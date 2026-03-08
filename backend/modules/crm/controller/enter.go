package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/modules/crm/service"
)

var CrmRouter = new(RouterGroup)

const MODULE_NAME = "crm"

type RouterGroup struct {
	EntityRouter
}

func (rg *RouterGroup) InitCrmRouter(r *gin.RouterGroup) {
	rg.InitEntityRouter(MODULE_NAME, r)

}

var (
	entityService = service.CrmService.EntityService
)
