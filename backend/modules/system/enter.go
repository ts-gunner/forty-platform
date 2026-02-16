package system

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/modules/system/controller"
)

var SystemModule = new(RouterGroup)

type RouterGroup struct {
	controller.AuthRouter
}

func (rg *RouterGroup) InitSystemRouter(r *gin.RouterGroup) {
	rt := r.Group("system")
	rg.InitAuthRouter(rt)
}
