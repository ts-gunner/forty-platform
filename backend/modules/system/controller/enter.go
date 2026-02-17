package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/modules/system/service"
)

var SystemRouter = new(RouterGroup)

const MODULE_NAME = "system"

type RouterGroup struct {
	AuthRouter
}

func (rg *RouterGroup) InitSystemRouter(r *gin.RouterGroup) {
	rg.InitAuthRouter(MODULE_NAME, r)
}

var (
	authService = service.SystemService.AuthService
	userService = service.SystemService.UserService
)
