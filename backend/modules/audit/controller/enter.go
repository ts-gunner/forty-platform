package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/modules/audit/service"
)

var AuditRouter = new(RouterGroup)

const MODULE_NAME = "audit"

type RouterGroup struct {
	ReviewRouter
}

func (rg *RouterGroup) InitAuditRouter(r *gin.RouterGroup) {
	rg.InitReviewRouter(MODULE_NAME, r)

}

var (
	reviewService = service.AuditService.ReviewService
)
