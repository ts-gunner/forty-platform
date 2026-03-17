package mapper

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
)

type CrmEntityMapper struct{}

func (CrmEntityMapper) GetEntityById(entityId int64) (*entity.CrmCustomerEntity, error) {
	var entityObj entity.CrmCustomerEntity
	if err := global.DB.Where(map[string]any{
		"id":        entityId,
		"is_delete": 0,
	}).First(&entityObj).Error; err != nil {
		return nil, err
	}
	return &entityObj, nil
}
