package service

import (
	"errors"
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	response "github.com/ts-gunner/forty-platform/common/response/crm"
)

type EntityFieldService struct{}

func (EntityFieldService) GetFieldsByEntityId(entityId int64) ([]response.CrmEntityFieldVo, error) {
	var ent *entity.CrmCustomerEntity

	if err := global.DB.Model(&entity.CrmCustomerEntity{}).Where(&entity.CrmCustomerEntity{
		Id: entityId,
		BaseSchemaField: entity.BaseSchemaField{
			IsDelete: 0,
		},
	}).First(&ent).Error; err != nil {
		return nil, err
	}
	if ent == nil {
		return nil, errors.New("该实体无法找到!")
	}

	var entityFields []entity.CrmCustomerFields
	if err := global.DB.Where("entity_id = ? and is_delete = 0", entityId).Find(&entityFields).Error; err != nil {
		return nil, err
	}

	var result []response.CrmEntityFieldVo
	if err := copier.Copy(&result, entityFields); err != nil {
		return nil, errors.New("该实体复制出现异常: " + err.Error())
	}
	return result, nil
}
