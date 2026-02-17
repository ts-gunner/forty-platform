package service

var SystemService = new(ServiceGroup)

type ServiceGroup struct {
	AuthService
	UserService
}
