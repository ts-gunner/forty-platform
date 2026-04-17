package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/ts-gunner/forty-platform/common/models"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm/clause"

	"gorm.io/gorm"

	"github.com/jinzhu/copier"
	"github.com/samber/lo"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/enums"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"github.com/ts-gunner/forty-platform/common/utils"
	"go.uber.org/zap"
	"gorm.io/datatypes"
)

type EntityValueService struct {
}

func (EntityValueService) GetEntityValuePageListBySelf(ctx context.Context, req request.GetCrmEntityValueListRequest) (*crmResponse.CrmEntityValueObjectVo, error) {
	entityObject, err := entityMapper.GetEntityByKey(req.EntityKey)
	if err != nil {
		return nil, err
	}
	if entityObject == nil {
		return nil, errors.New("该实体不存在")
	}
	db := global.DB.Table("crm_customer_values c").
		Select("c.*, s.nickname as user_name, IF(f.id is not null, 1, 0) as is_favorite").
		Joins("LEFT JOIN sys_user s ON c.user_id = s.user_id").
		Joins("LEFT JOIN crm_customer_favorite f ON f.entity_id = c.entity_id AND f.value_id = c.id").
		Where("c.entity_id = ? and c.user_id = ? and c.is_delete = 0", entityObject.Id, utils.GetLoginUserId(ctx))
	return FindEntityValuePageList(db, entityObject.Id, models.FindCrmValueParams{
		FilterParams: req.FilterParams,
		PageNum:      req.PageNum,
		PageSize:     req.PageSize,
		UserId:       0,
	})
}
func (EntityValueService) GetEntityValuePageList(req request.GetCrmEntityValueListRequest) (*crmResponse.CrmEntityValueObjectVo, error) {
	entityObject, err := entityMapper.GetEntityByKey(req.EntityKey)
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}
	if entityObject == nil {
		return nil, errors.New("该实体不存在")
	}
	db := global.DB.Table("crm_customer_values c").
		Select("c.*, s.nickname as user_name").
		Joins("LEFT JOIN sys_user s ON c.user_id = s.user_id").
		Joins("LEFT JOIN crm_customer_favorite f ON f.entity_id = c.entity_id AND f.value_id = c.id").
		Where("c.entity_id = ? and c.is_delete = 0", entityObject.Id)

	return FindEntityValuePageList(db, entityObject.Id, models.FindCrmValueParams{
		FilterParams: req.FilterParams,
		PageNum:      req.PageNum,
		PageSize:     req.PageSize,
		UserId:       req.UserId,
	})
}

func (EntityValueService) AdminGetEntityValuePageList(req request.AdminGetCrmEntityValueListRequest) (*crmResponse.CrmEntityValueObjectVo, error) {
	entityObject, err := entityMapper.GetEntityById(req.EntityId)
	if err != nil {
		return nil, err
	}
	if entityObject == nil {
		return nil, errors.New("该实体不存在")
	}
	db := global.DB.Table("crm_customer_values c").
		Select("c.*, s.nickname as user_name").
		Joins("LEFT JOIN sys_user s ON c.user_id = s.user_id").
		Where("c.entity_id = ?", entityObject.Id)
	if req.IsDelete != nil {
		if *req.IsDelete == 0 {
			db = db.Where("c.is_delete = 0")
		} else if *req.IsDelete == 1 {
			db = db.Where("c.is_delete = 1")
		}
	}

	return FindEntityValuePageList(db, entityObject.Id, models.FindCrmValueParams{
		FilterParams: req.FilterParams,
		PageNum:      req.PageNum,
		PageSize:     req.PageSize,
		UserId:       req.UserId,
	})
}
func FindEntityValuePageList(db *gorm.DB, entityId int64, req models.FindCrmValueParams) (*crmResponse.CrmEntityValueObjectVo, error) {
	var vos []crmResponse.CrmEntityValueVo
	fields, err := entityFieldMapper.GetEntityFieldsByEntityId(global.DB, entityId)
	if err != nil {
		return nil, err
	}
	if req.FilterParams != nil {
		for k, v := range req.FilterParams {
			if v == nil {
				continue
			}
			field, ok := lo.Find(fields, func(field entity.CrmCustomerFields) bool {
				return field.FieldKey == k
			})
			if !ok {
				continue
			}
			switch enums.CrmFieldDataType(field.DataType) {
			case enums.CrmDataTypeText:
				query := fmt.Sprintf("c.values ->>'$.%s' LIKE %s", field.FieldKey, "CONCAT('%', ?, '%')")
				db = db.Where(query, v.(string))
			case enums.CrmDataTypePicker:
				inQuery := fmt.Sprintf("c.values ->>'$.%s' IN ?", field.FieldKey)
				equalQuery := fmt.Sprintf("c.values ->>'$.%s' = ?", field.FieldKey)
				options := strings.Split(v.(string), ",")
				if len(options) >= 2 {
					db = db.Where(inQuery, strings.Split(v.(string), ","))
				} else if len(options) == 1 {
					db = db.Where(equalQuery, v.(string))
				}
			case enums.CrmDataTypePickerOrOther:
				inQuery := fmt.Sprintf("c.values ->>'$.%s' IN ?", field.FieldKey)
				equalQuery := fmt.Sprintf("c.values ->>'$.%s' = ?", field.FieldKey)
				options := strings.Split(v.(string), ",")
				if len(options) >= 2 {
					db = db.Where(inQuery, strings.Split(v.(string), ","))
				} else if len(options) == 1 {
					db = db.Where(equalQuery, v.(string))
				}
			}

		}
	}
	if req.UserId != 0 {
		db = db.Where("c.user_id = ?", req.UserId)
	}

	pageNum := utils.GetCurrentPage(req.PageNum)
	pageSize := utils.GetPageSize(req.PageSize)
	var dataLength int64
	if err := db.Count(&dataLength).Error; err != nil {
		return nil, err
	}
	offset := (pageNum - 1) * pageSize
	if err := db.Order("create_time DESC").Offset(offset).Limit(pageSize).Find(&vos).Error; err != nil {
		return nil, err
	}
	return &crmResponse.CrmEntityValueObjectVo{
		EntityValue: response.PageResult[crmResponse.CrmEntityValueVo]{
			List:     vos,
			Total:    dataLength,
			PageNum:  pageNum,
			PageSize: pageSize,
		},
	}, nil
}

func (EntityValueService) GetEntityValueDetail(entityValueId int64) (*crmResponse.CrmEntityValueVo, error) {
	var value entity.CrmCustomerValues
	if err := global.DB.Model(&entity.CrmCustomerValues{}).Where("id = ? and is_delete = 0", entityValueId).First(&value).Error; err != nil {
		return nil, err
	}
	var vo crmResponse.CrmEntityValueVo
	if err := copier.Copy(&vo, &value); err != nil {
		return nil, err
	}
	return &vo, nil

}

func (EntityValueService) GetEntityValueDetailBySelf(ctx context.Context, entityValueId int64) (*crmResponse.CrmEntityValueVo, error) {
	var value entity.CrmCustomerValues
	if err := global.DB.Model(&entity.CrmCustomerValues{}).Where("id = ? and is_delete = 0", entityValueId).First(&value).Error; err != nil {
		return nil, err
	}
	if value.UserId != utils.GetLoginUserId(ctx) {
		return nil, fmt.Errorf("无权限查看该客户信息")
	}
	var vo crmResponse.CrmEntityValueVo
	if err := copier.Copy(&vo, &value); err != nil {
		return nil, err
	}
	return &vo, nil

}
func handleValueByFieldList(fieldList []entity.CrmCustomerFields, entityValues string) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	// 解析并校验 values
	var dict map[string]interface{}
	if err := json.Unmarshal([]byte(entityValues), &dict); err != nil {
		return nil, err
	}

	for _, field := range fieldList {
		val, err := validateValue(field, dict)
		if err != nil {
			return nil, err
		}
		result[field.FieldKey] = val

	}
	return result, nil
}

/*
*
校验并返回处理后的值
*/
func validateValue(field entity.CrmCustomerFields, values map[string]any) (any, error) {
	switch enums.CrmFieldDataType(field.DataType) {
	case enums.CrmDataTypeNumber:
		val := lo.ValueOr(values, field.FieldKey, -1).(int)
		if field.IsRequired && val == -1 {
			return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
		}
		return val, nil
	case enums.CrmDataTypeBoolean:
		val := lo.ValueOr(values, field.FieldKey, "").(string)
		if val == "是" {
			return true, nil
		} else {
			return false, nil
		}
	case enums.CrmDataTypeDate:
		val := lo.ValueOr(values, field.FieldKey, "").(string)
		if field.IsRequired && val == "" {
			return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
		}
		if val != "" {
			_, err := time.Parse(time.DateOnly, val)
			if err != nil {
				return nil, errors.New(fmt.Sprintf("[%s]日期格式不正确，应为 YYYY-MM-DD", field.FieldName))
			}
		}
		return val, nil
	case enums.CrmDataTypePicker:
		val := lo.ValueOr(values, field.FieldKey, "").(string)
		if field.IsRequired && val == "" {
			return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
		}
		var options []string
		if err := json.Unmarshal(*field.Options, &options); err != nil {
			errorMsg := fmt.Sprintf("[%s]该字段的值反序列化异常", field.FieldName)
			global.Logger.Error(errorMsg, zap.Any("field options", field.Options))
			return nil, errors.New(errorMsg)
		}
		if val != "" && !lo.Contains(options, val) {
			return nil, errors.New(fmt.Sprintf("【%s】 不在[%s]该字段的选择范围内", val, field.FieldName))
		}
		return val, nil
	case enums.CrmDataTypeLocation:
		val := lo.ValueOr(values, field.FieldKey, "").(string)
		var location models.LocationData
		if err := json.Unmarshal([]byte(val), &location); err != nil {
			// 反序列化异常，则存入普通字符串即可
			return val, nil
		}
		return val, nil
	default:
		val := lo.ValueOr(values, field.FieldKey, "").(string)
		if field.IsRequired && val == "" {
			return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
		}
		return val, nil
	}
}
func (EntityValueService) InsertEntityValueData(ctx context.Context, req request.InsertCrmEntityValueRequest) error {
	entityObject, err := entityMapper.GetEntityById(req.EntityId)
	if err != nil && err != gorm.ErrRecordNotFound {
		return err
	}
	if entityObject == nil {
		return errors.New("该实体不存在")
	}

	// 找到他的字段
	fieldList, err := entityFieldMapper.GetEntityFieldsByEntityId(global.DB, req.EntityId)
	if err != nil {
		return err
	}

	for _, data := range req.Data {
		var dict map[string]interface{}
		if err := json.Unmarshal([]byte(data.Values), &dict); err != nil {
			return err
		}
		result, err := handleValueByFieldList(fieldList, data.Values)
		if err != nil {
			return err
		}
		customerName := lo.ValueOr(dict, constant.CRM_CUSTOMER_NAME, "").(string)
		remark := lo.ValueOr(dict, constant.CRM_CUSTOMER_REMARK, "").(string)
		resultBytes, err := json.Marshal(result)
		if err != nil {
			return err
		}
		var values []entity.CrmCustomerValues
		userId := utils.GetLoginUserId(ctx)
		values = append(values, entity.CrmCustomerValues{
			EntityId:     req.EntityId,
			CustomerName: customerName,
			Remark:       remark,
			Values:       datatypes.JSON(resultBytes),
			UserId:       userId,
			BaseRecordField: entity.BaseRecordField{
				CreatorId: userId,
			},
		})

		global.DB.CreateInBatches(values, 10)
	}

	return nil
}

func (EntityValueService) UpdateEntityValueData(ctx context.Context, req request.UpdateCrmEntityValueRequest) error {
	// 查找要更新的记录
	var entityValue entity.CrmCustomerValues
	if err := global.DB.First(&entityValue, req.Id).Error; err != nil {
		return errors.New("该记录不存在")
	}

	// 找到实体的字段
	fieldList, err := entityFieldMapper.GetEntityFieldsByEntityId(global.DB, entityValue.EntityId)
	if err != nil {
		return err
	}
	result, err := handleValueByFieldList(fieldList, req.Values)
	if err != nil {
		return err
	}
	// 序列化结果
	resultBytes, err := json.Marshal(result)
	if err != nil {
		return err
	}

	// 更新记录
	updates := map[string]interface{}{
		"customer_name": req.CustomerName,
		"remark":        req.Remark,
		"values":        datatypes.JSON(resultBytes),
		"updater_id":    utils.GetLoginUserId(ctx),
	}

	if err := global.DB.Model(&entityValue).Updates(updates).Error; err != nil {
		return err
	}

	return nil
}

func (EntityValueService) DeleteEntityValueData(ctx context.Context, id int64) error {
	operatorId := utils.GetLoginUserId(ctx)
	return global.DB.Transaction(func(tx *gorm.DB) error {
		var entityValue entity.CrmCustomerValues
		if err := tx.Where("id = ? and is_delete = 0", id).First(&entityValue).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("找不到该记录")
			}
			return err
		}

		exists, err := global.Enforcer.HasGroupingPolicy(strconv.FormatInt(operatorId, 10), constant.ROLE_WECHAT_CRM_ADMIN)
		if err != nil {
			return err
		}
		if !exists && entityValue.UserId != operatorId {
			return fmt.Errorf("没有权限删除该数据")
		}
		updates := make(map[string]interface{})
		updates["deleter_id"] = operatorId
		updates["is_delete"] = 1
		// 软删除记录
		if err := tx.Model(&entity.CrmCustomerValues{}).Where("id = ?", id).Updates(updates).Error; err != nil {
			return err
		}
		return nil
	})

}

func (EntityValueService) HandleUploadExcel(ctx context.Context, req request.UploadCrmValueRequest, operatorId *int64) error {
	var userId int64
	if operatorId == nil {
		userId = utils.GetLoginUserId(ctx)
	} else {
		userId = *operatorId
	}
	ext := filepath.Ext(req.File.Filename)
	if !lo.Contains([]string{".xlsx", ".xls"}, ext) {
		return fmt.Errorf("不支持上传%s", ext)
	}
	file, _ := req.File.Open()
	defer file.Close()
	f, err := excelize.OpenReader(file)
	if err != nil {
		global.Logger.Error("读取excel表错误", zap.Error(err))
		return fmt.Errorf("读取excel表错误")
	}
	defer f.Close()
	name := f.GetSheetName(0)
	rows, err := f.GetRows(name)
	if err != nil {
		return fmt.Errorf("读取excel表数据错误")
	}
	fields, err := entityFieldMapper.GetEntityFieldsByEntityId(global.DB, req.EntityId)
	if err != nil {
		return err
	}
	isMatch := false
	// 客户名称匹配结果
	customerNameMatch := false
	fieldMap := make(map[int]entity.CrmCustomerFields)
	// 拿表第一行作为字段匹配
	for idx, column := range rows[0] {
		field, ok := lo.Find(fields, func(item entity.CrmCustomerFields) bool {
			return item.FieldName == column
		})
		if ok {
			isMatch = true
			fieldMap[idx] = field
		}
		if field.FieldKey == constant.CRM_CUSTOMER_NAME {
			customerNameMatch = true
		}

	}
	if !isMatch || !customerNameMatch {
		f, _ := lo.Find(fields, func(item entity.CrmCustomerFields) bool {
			return item.FieldKey == constant.CRM_CUSTOMER_NAME
		})
		return fmt.Errorf("跟实体表字段没有任何匹配项或者缺少[%s]字段", f.FieldName)
	}
	valueData := make([]entity.CrmCustomerValues, 0)
	// 整理数据
	for _, row := range rows[1:] {
		data := make(map[string]interface{})
		value := entity.CrmCustomerValues{
			EntityId: req.EntityId,
			UserId:   userId,
			BaseRecordField: entity.BaseRecordField{
				CreatorId: userId,
				UpdaterId: &userId,
			},
		}
		for idx, col := range row {
			field, ok := fieldMap[idx]
			if ok {
				val, err := validateValue(field, map[string]any{
					field.FieldKey: col,
				})
				if err != nil {
					return err
				}
				if field.FieldKey == constant.CRM_CUSTOMER_REMARK {
					value.Remark = val.(string)
				}
				if field.FieldKey == constant.CRM_CUSTOMER_NAME {
					value.CustomerName = val.(string)
				}
				data[field.FieldKey] = val
			}
		}
		byteData, _ := json.Marshal(data)
		value.Values = datatypes.JSON(byteData)
		valueData = append(valueData, value)
	}
	if err := global.DB.Clauses(clause.OnConflict{
		Columns: []clause.Column{
			{Name: "customer_name"},
			{Name: "entity_id"},
			{Name: "user_id"},
		},                                                                               // 判重唯一键，对应数据库字段名
		DoUpdates: clause.AssignmentColumns([]string{"remark", "values", "updater_id"}), // 存在时更新的字段
	}).Create(&valueData).Error; err != nil {
		return fmt.Errorf("创建失败：%v", err)
	}
	return nil
}

func (EntityValueService) CountValue(ctx context.Context, entityId int64) (crmResponse.CrmValueCountVo, error) {
	resp := crmResponse.CrmValueCountVo{}
	ent, err := entityMapper.GetEntityById(entityId)
	if err != nil {
		return resp, err
	}
	if ent == nil {
		return resp, fmt.Errorf("实体不存在")
	}
	userId := utils.GetLoginUserId(ctx)

	var mineCount int64
	if err := global.DB.Table("crm_customer_values").Where("is_delete = 0 AND user_id = ? AND entity_id = ?", userId, ent.Id).Count(&mineCount).Error; err != nil {
		return resp, err
	}
	var allCount int64
	if err := global.DB.Table("crm_customer_values").Where("is_delete = 0 AND entity_id = ?", ent.Id).Count(&allCount).Error; err != nil {
		return resp, err
	}
	resp.MineValueCount = mineCount
	resp.AllValueCount = allCount

	return resp, nil
}
