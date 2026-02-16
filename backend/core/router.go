package core

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/modules/system"
)

func initRouter() *gin.Engine {
	r := gin.Default()
	r.Use(gin.Recovery())
	contextGroup := r.Group(Config.Servlet.ContextPath)
	system.SystemModule.InitSystemRouter(contextGroup)
	return r
}
