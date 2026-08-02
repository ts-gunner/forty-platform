package service

import (
	"github.com/ts-gunner/forty-platform/modules/crm/mapper"
	systemService "github.com/ts-gunner/forty-platform/modules/system/service"
)

var CrmService = new(ServiceGroup)

type ServiceGroup struct {
	EntityService
	EntityFieldService
	EntityValueService
	CustomerFavoriteService
}

var (
	entityMapper      = mapper.CrmModel.CrmEntityMapper
	entityFieldMapper = mapper.CrmModel.CrmEntityFieldMapper
)

var (
	resourceService = systemService.SystemService.SystemResourceService
)
