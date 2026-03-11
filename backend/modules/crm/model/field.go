package model

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"gorm.io/gorm"
)

type CrmEntityFieldModel struct{}

func (CrmEntityFieldModel) GetEntityFieldsByEntityId(tx *gorm.DB, entityId int64) []*entity.CrmCustomerFields {
	var entityFields []*entity.CrmCustomerFields
	tx.Where(&entity.CrmCustomerFields{
		EntityId: entityId,
		BaseSchemaField: entity.BaseSchemaField{
			IsDelete: 0,
		},
	}).Find(&entityFields)
	return entityFields
}
