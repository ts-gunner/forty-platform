package model

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"gorm.io/gorm"
)

type CrmEntityFieldModel struct{}

func (CrmEntityFieldModel) GetEntityFieldsByEntityIdWithDeleted(tx *gorm.DB, entityId int64) []entity.CrmCustomerFields {
	var entityFields []entity.CrmCustomerFields
	tx.Where("entity_id = ?", entityId).Find(&entityFields)
	return entityFields
}
