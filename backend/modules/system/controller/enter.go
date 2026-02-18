package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/modules/system/service"
)

var SystemRouter = new(RouterGroup)

const MODULE_NAME = "system"

type RouterGroup struct {
	AuthRouter
	UserRouter
	RoleRouter
	PermissionRouter
	UserRoleRelRouter
	RolePermissionRelRouter
}

func (rg *RouterGroup) InitSystemRouter(r *gin.RouterGroup) {
	rg.InitAuthRouter(MODULE_NAME, r)
	rg.InitUserRouter(MODULE_NAME, r)
	rg.InitRoleRouter(MODULE_NAME, r)
	rg.InitPermissionRouter(MODULE_NAME, r)
	rg.InitUserRoleRelRouter(MODULE_NAME, r)
	rg.InitRolePermissionRelRouter(MODULE_NAME, r)
}

var (
	authService              = service.SystemService.AuthService
	userService              = service.SystemService.UserService
	roleService              = service.SystemService.RoleService
	permissionService        = service.SystemService.PermissionService
	userRoleRelService       = service.SystemService.UserRoleRelService
	rolePermissionRelService = service.SystemService.RolePermissionRelService
)
