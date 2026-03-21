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
	SystemResourceService
}

var (
	roleMapper     = mapper.SystemMapper.RoleMapper
	userMapper     = mapper.SystemMapper.SysUserMapper
	resourceMapper = mapper.SystemMapper.SysResourceMapper
)
