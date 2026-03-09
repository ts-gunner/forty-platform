package service

import (
	"context"
	"errors"

	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	response "github.com/ts-gunner/forty-platform/common/response/crm"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type EntityFieldService struct{}

func (EntityFieldService) GetFieldById(fieldId int64) (*entity.CrmCustomerFields, error) {
	var field entity.CrmCustomerFields
	if err := global.DB.Where(map[string]any{
		"id":        fieldId,
		"is_delete": 0,
	}).First(&field).Error; err != nil {
		return nil, err
	}
	return &field, nil
}

func (EntityFieldService) GetFieldsByEntityId(entityId int64) ([]response.CrmEntityFieldVo, error) {
	_, err := entityModel.GetEntityById(entityId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("实体不存在")
		}
		return nil, err
	}

	var entityFields []entity.CrmCustomerFields
	if err := global.DB.Where("entity_id = ? and is_delete = 0", entityId).Order("sort_order ASC").Find(&entityFields).Error; err != nil {
		return nil, err
	}

	var result []response.CrmEntityFieldVo
	if err := copier.Copy(&result, entityFields); err != nil {
		return nil, errors.New("该实体复制出现异常: " + err.Error())
	}
	return result, nil
}

func (EntityFieldService) AddEntityField(ctx context.Context, req request.AddCrmEntityFieldRequest) error {
	_, err := entityModel.GetEntityById(req.EntityId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("实体不存在")
		}
		return err
	}

	var existField entity.CrmCustomerFields
	if err := global.DB.Where("entity_id = ? AND field_key = ? AND is_delete = 0", req.EntityId, req.FieldKey).First(&existField).Error; err == nil {
		return errors.New("字段标识已存在")
	}

	fieldObject := &entity.CrmCustomerFields{
		EntityId:    req.EntityId,
		FieldKey:    req.FieldKey,
		DisplayName: req.FieldName,
		DataType:    req.DataType,
		IsRequired:  req.IsRequired,
		SortOrder:   req.SortOrder,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: utils.GetLoginUserId(ctx),
		},
	}
	return global.DB.Create(fieldObject).Error
}

func (EntityFieldService) UpdateEntityField(ctx context.Context, req request.UpdateCrmEntityFieldRequest) error {
	field, err := EntityFieldService{}.GetFieldById(req.FieldId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("字段不存在")
		}
		return err
	}

	updates := map[string]any{}
	if req.FieldName != "" {
		updates["display_name"] = req.FieldName
	}
	if req.FieldKey != "" {
		var existField entity.CrmCustomerFields
		if err := global.DB.Where("entity_id = ? AND field_key = ? AND is_delete = 0 AND id != ?", field.EntityId, req.FieldKey, req.FieldId).First(&existField).Error; err == nil {
			return errors.New("字段标识已存在")
		}
		updates["field_key"] = req.FieldKey
	}
	if req.DataType != nil {
		updates["data_type"] = *req.DataType
	}
	if req.IsRequired != nil {
		updates["is_required"] = *req.IsRequired
	}
	if req.SortOrder != nil {
		updates["sort_order"] = *req.SortOrder
	}

	if len(updates) == 0 {
		return nil
	}

	updaterId := utils.GetLoginUserId(ctx)
	updates["updater_id"] = updaterId

	return global.DB.Model(field).Updates(updates).Error
}

func (EntityFieldService) DeleteEntityField(ctx context.Context, fieldId int64) error {
	field, err := EntityFieldService{}.GetFieldById(fieldId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("字段不存在")
		}
		return err
	}

	deleterId := utils.GetLoginUserId(ctx)
	return global.DB.Model(field).Updates(map[string]any{
		"is_delete":  1,
		"deleter_id": deleterId,
	}).Error
}
