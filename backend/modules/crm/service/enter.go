package service

import "github.com/ts-gunner/forty-platform/modules/crm/model"

var CrmService = new(ServiceGroup)

type ServiceGroup struct {
	EntityService
	EntityFieldService
}

var (
	entityModel      = model.CrmModel.CrmEntityModel
	entityFieldModel = model.CrmModel.CrmEntityFieldModel
)
