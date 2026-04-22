package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/modules/analysis/service"
)

var AnalysisRouter = new(RouterGroup)

const MODULE_NAME = "analysis"

type RouterGroup struct {
	StatisticsRouter
}

func (rg *RouterGroup) InitAnalysisRouter(r *gin.RouterGroup) {
	rg.InitStatisticsRouter(MODULE_NAME, r)

}

var (
	statisticsService = service.AnalysisService.StatisticsService
)
