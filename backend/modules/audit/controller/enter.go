package controller

import (
	"github.com/gin-gonic/gin"
)

var AuditRouter = new(RouterGroup)

const MODULE_NAME = "audit"

type RouterGroup struct {
}

func (rg *RouterGroup) InitAuditRouter(r *gin.RouterGroup) {
	//rg.InitEntityRouter(MODULE_NAME, r)

}

var (
//entityService           = service.CrmService.EntityService

)
