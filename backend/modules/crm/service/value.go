package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

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
	"gorm.io/datatypes"
)

type EntityValueService struct {
}

func (EntityValueService) GetEntityValuePageList(req request.GetCrmEntityValueListRequest) (*crmResponse.CrmEntityValueObjectVo, error) {
	entityObject, err := entityModel.GetEntityById(req.EntityId)
	if err != nil {
		return nil, err
	}
	if entityObject == nil {
		return nil, errors.New("该实体不存在")
	}
	var entityValues []entity.CrmCustomerValues
	var total int64
	db := global.DB.Model(&entity.CrmCustomerValues{}).Where("entity_id = ? and is_delete = 0", req.EntityId)
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

	list := make([]crmResponse.CrmEntityValueVo, 0, len(entityValues))
	for _, e := range entityValues {
		list = append(list, crmResponse.CrmEntityValueVo{
			Id:           e.Id,
			CustomerName: e.CustomerName,
			Remark:       e.Remark,
			Values:       e.Values.String(),
			CreateTime:   e.UpdateTime,
		})
	}

	fieldList, err := entityFieldModel.GetEntityFieldsByEntityId(global.DB, req.EntityId)
	if err != nil {
		return nil, err
	}
	var fieldVos []crmResponse.CrmEntityFieldVo
	if err = copier.Copy(&fieldVos, fieldList); err != nil {
		return nil, err
	}
	return &crmResponse.CrmEntityValueObjectVo{
		EntityValue: response.PageResult[crmResponse.CrmEntityValueVo]{
			List:     list,
			Total:    total,
			PageNum:  req.PageNum,
			PageSize: req.PageSize,
		},
	}, nil
}

func (EntityValueService) InsertEntityValueData(ctx context.Context, req request.InsertCrmEntityValueRequest) error {
	entityObject, err := entityModel.GetEntityById(req.EntityId)
	if err != nil {
		return err
	}
	if entityObject == nil {
		return errors.New("该实体不存在")
	}

	// 找到他的字段
	fieldList, err := entityFieldModel.GetEntityFieldsByEntityId(global.DB, req.EntityId)
	if err != nil {
		return err
	}

	for _, data := range req.Data {
		var dict map[string]interface{}
		if err := json.Unmarshal([]byte(data.Values), &dict); err != nil {
			return err
		}
		var values []entity.CrmCustomerValues
		result := make(map[string]interface{})
		for _, field := range fieldList {
			switch enums.CrmFieldDataType(field.DataType) {
			case enums.CrmDataTypeText:
				val := lo.ValueOr(dict, field.FieldKey, "").(string)
				if field.IsRequired && val == "" {
					return errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
				}
				result[field.FieldKey] = val
			case enums.CrmDataTypeNumber:
				val := lo.ValueOr(dict, field.FieldKey, -1).(int)
				if field.IsRequired && val == -1 {
					return errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
				}
				result[field.FieldKey] = val
			case enums.CrmDataTypeBoolean:
				val := lo.ValueOr(dict, field.FieldKey, false).(bool)
				if field.IsRequired && &val == nil {
					return errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
				}
			case enums.CrmDataTypeDate:
				val := lo.ValueOr(dict, field.FieldKey, "").(string)
				if field.IsRequired && val == "" {
					return errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
				}
				result[field.FieldKey] = val
			case enums.CrmDataTypeRegion:
				val := lo.ValueOr(dict, field.FieldKey, "").(string)
				if field.IsRequired && val == "" {
					return errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
				}
				result[field.FieldKey] = val
			case enums.CrmDataTypePicker:
				val := lo.ValueOr(dict, field.FieldKey, "").(string)
				if field.IsRequired && val == "" {
					return errors.New(fmt.Sprintf("[%s]该字段是必填项，不能为空", field.FieldName))
				}
				result[field.FieldKey] = val
			default:
			}

		}
		customerName := lo.ValueOr(dict, constant.CRM_CUSTOMER_NAME, "").(string)
		remark := lo.ValueOr(dict, constant.CRM_CUSTOMER_REMARK, "").(string)
		resultBytes, err := json.Marshal(result)
		if err != nil {
			return err
		}

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
