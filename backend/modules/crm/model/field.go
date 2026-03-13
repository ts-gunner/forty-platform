package model

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	"gorm.io/gorm"
)

type CrmEntityFieldModel struct{}

func (CrmEntityFieldModel) GetEntityFieldsByEntityIdWithDeleted(tx *gorm.DB, entityId int64) []entity.CrmCustomerFields {
	var entityFields []entity.CrmCustomerFields
	tx.Where("entity_id = ?", entityId).Find(&entityFields)
	return entityFields
}
func (CrmEntityFieldModel) GetEntityFieldsByEntityId(tx *gorm.DB, entityId int64) ([]entity.CrmCustomerFields, error) {
	var entityFields = make([]entity.CrmCustomerFields, 0)
	if err := global.DB.Where(map[string]any{
		"entity_id": entityId,
		"is_delete": 0,
	}).Order("sort_order ASC").Find(&entityFields).Error; err != nil {
		return entityFields, err
	}
	return entityFields, nil
}
