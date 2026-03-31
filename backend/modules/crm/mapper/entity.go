package mapper

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	"gorm.io/gorm"
)

type CrmEntityMapper struct{}

func (CrmEntityMapper) GetEntityById(entityId int64) (*entity.CrmCustomerEntity, error) {
	var entityObj entity.CrmCustomerEntity
	if err := global.DB.Where(map[string]any{
		"id":        entityId,
		"is_delete": 0,
	}).First(&entityObj).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &entityObj, nil
}

func (CrmEntityMapper) GetEntityByKey(entityKey string) (*entity.CrmCustomerEntity, error) {
	var entityObj entity.CrmCustomerEntity
	if err := global.DB.Where(map[string]any{
		"entity_code": entityKey,
		"is_delete":   0,
	}).First(&entityObj).Error; err != nil {
		return nil, err
	}
	return &entityObj, nil
}
