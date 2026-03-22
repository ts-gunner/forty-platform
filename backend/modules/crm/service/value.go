package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

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
	var entityValues []entity.CrmCustomerValues
	db := global.DB.Model(&entity.CrmCustomerValues{}).Where(
		"entity_id = ? and creator_id = ? and is_delete = 0",
		entityObject.Id, utils.GetLoginUserId(ctx),
	)
	if req.PageNum <= 0 {
		req.PageNum = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}
	offset := (req.PageNum - 1) * req.PageSize
	if err := db.Order("create_time DESC").Offset(offset).Limit(req.PageSize).Find(&entityValues).Error; err != nil {
		return nil, err
	}
	return convert2EntityValueVos(entityValues, response.PageInfo{
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
		Total:    int64(len(entityValues)),
	})
}
func (EntityValueService) GetEntityValuePageList(req request.GetCrmEntityValueListRequest) (*crmResponse.CrmEntityValueObjectVo, error) {
	entityObject, err := entityMapper.GetEntityByKey(req.EntityKey)
	if err != nil {
		return nil, err
	}
	if entityObject == nil {
		return nil, errors.New("该实体不存在")
	}
	var entityValues []entity.CrmCustomerValues
	db := global.DB.Model(&entity.CrmCustomerValues{}).Where("entity_id = ? and is_delete = 0", entityObject.Id)
	if req.PageNum <= 0 {
		req.PageNum = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}
	offset := (req.PageNum - 1) * req.PageSize
	if err := db.Order("create_time DESC").Offset(offset).Limit(req.PageSize).Find(&entityValues).Error; err != nil {
		return nil, err
	}
	return convert2EntityValueVos(entityValues, response.PageInfo{
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
		Total:    int64(len(entityValues)),
	})
}

func convert2EntityValueVos(entityValues []entity.CrmCustomerValues, info response.PageInfo) (*crmResponse.CrmEntityValueObjectVo, error) {
	list := make([]crmResponse.CrmEntityValueVo, 0, len(entityValues))
	for _, e := range entityValues {
		list = append(list, crmResponse.CrmEntityValueVo{
			Id:           e.Id,
			EntityId:     e.EntityId,
			CustomerName: e.CustomerName,
			Remark:       e.Remark,
			Values:       e.Values.String(),
			CreateTime:   e.UpdateTime,
		})
	}
	return &crmResponse.CrmEntityValueObjectVo{
		EntityValue: response.PageResult[crmResponse.CrmEntityValueVo]{
			List:     list,
			Total:    info.Total,
			PageNum:  info.PageNum,
			PageSize: info.PageSize,
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
	if value.CreatorId != utils.GetLoginUserId(ctx) {
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

	// 解析 values
	var dict map[string]interface{}
	if err := json.Unmarshal([]byte(entityValues), &dict); err != nil {
		return nil, err
	}

	for _, field := range fieldList {
		switch enums.CrmFieldDataType(field.DataType) {
		case enums.CrmDataTypeText:
			val := lo.ValueOr(dict, field.FieldKey, "").(string)
			if field.IsRequired && val == "" {
				return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
			}
			result[field.FieldKey] = val
		case enums.CrmDataTypeNumber:
			val := lo.ValueOr(dict, field.FieldKey, -1).(int)
			if field.IsRequired && val == -1 {
				return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
			}
			result[field.FieldKey] = val
		case enums.CrmDataTypeBoolean:
			val := lo.ValueOr(dict, field.FieldKey, false).(bool)
			result[field.FieldKey] = val
		case enums.CrmDataTypeDate:
			val := lo.ValueOr(dict, field.FieldKey, "").(string)
			if field.IsRequired && val == "" {
				return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
			}
			if val != "" {
				_, err := time.Parse(time.DateOnly, val)
				if err != nil {
					return nil, errors.New(fmt.Sprintf("[%s]日期格式不正确，应为 YYYY-MM-DD", field.FieldName))
				}
			}

			result[field.FieldKey] = val
		case enums.CrmDataTypeRegion:
			val := lo.ValueOr(dict, field.FieldKey, "").(string)
			if field.IsRequired && val == "" {
				return nil, errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
			}
			result[field.FieldKey] = val
		case enums.CrmDataTypePicker:
			val := lo.ValueOr(dict, field.FieldKey, "").(string)
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

			result[field.FieldKey] = val
		default:
		}

	}
	return result, nil
}
func (EntityValueService) InsertEntityValueData(ctx context.Context, req request.InsertCrmEntityValueRequest) error {
	entityObject, err := entityMapper.GetEntityById(req.EntityId)
	if err != nil {
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

		values = append(values, entity.CrmCustomerValues{
			EntityId:     req.EntityId,
			CustomerName: customerName,
			Remark:       remark,
			Values:       datatypes.JSON(resultBytes),
			BaseRecordField: entity.BaseRecordField{
				CreatorId: utils.GetLoginUserId(ctx),
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
	// 软删除记录
	if err := global.DB.Model(&entity.CrmCustomerValues{}).Where("id = ?", id).Update("is_delete", 1).Error; err != nil {
		return err
	}

	return nil
}
