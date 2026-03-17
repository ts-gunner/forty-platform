package service

import "github.com/ts-gunner/forty-platform/modules/crm/mapper"

var CrmService = new(ServiceGroup)

type ServiceGroup struct {
	EntityService
	EntityFieldService
	EntityValueService
}

var (
	entityMapper      = mapper.CrmModel.CrmEntityMapper
	entityFieldMapper = mapper.CrmModel.CrmEntityFieldMapper
)
