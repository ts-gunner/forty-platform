package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/response"
)

type AuthRouter struct{}

func (AuthRouter) InitAuthRouter(router *gin.RouterGroup) {
	routerGroup := router.Group("auth")
	routerGroup.GET("adminPwdLogin", adminPwdLogin)
}

func adminPwdLogin(c *gin.Context) {
	response.Ok(c)
}
