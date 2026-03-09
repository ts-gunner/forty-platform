package service

var CrmService = new(ServiceGroup)

type ServiceGroup struct {
	EntityService
	EntityFieldService
}
