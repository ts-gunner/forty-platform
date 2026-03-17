package service

import "github.com/ts-gunner/forty-platform/modules/system/mapper"

var SystemService = new(ServiceGroup)

type ServiceGroup struct {
	AuthService
	UserService
	RoleService
	PermissionService
	UserRoleRelService
	RolePermissionRelService
}

var (
	roleMapper = mapper.SystemMapper.RoleMapper
)
