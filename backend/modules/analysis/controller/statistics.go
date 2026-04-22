package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/response"
	analysisResponse "github.com/ts-gunner/forty-platform/common/response/analysis"
	"go.uber.org/zap"
	"net/http"
)

type StatisticsRouter struct{}

func (StatisticsRouter) InitStatisticsRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/statistics", moduleName))
	routerGroup.GET("/getBasicCount", getBasicCount)
	routerGroup.GET("/getCustomerCountByUser", getCustomerCountByUser)

}

// @Tags AnalysisController
// @ID getBasicCount
// @Router /analysis/statistics/getBasicCount [get]
// @Summary 获取基础数据指标值
// @Description 获取业务员总数，客户总数
// @Produce json
// @Success 200 {object} response.ApiResult[analysisResponse.BasicIndicator]
func getBasicCount(c *gin.Context) {
	indicator, err := statisticsService.GetBasicCount()
	if err != nil {
		global.Logger.Error("基础指标获取异常", zap.Error(err))
		response.Fail(http.StatusBadRequest, "基础指标获取异常", c)
		return
	}
	response.Data[analysisResponse.BasicIndicator](indicator, c)
}

// @Tags AnalysisController
// @ID getCustomerCountByUser
// @Router /analysis/statistics/getCustomerCountByUser [get]
// @Summary 获取客户数据跟业务员的相关指标值
// @Produce json
// @Success 200 {object} response.ApiResult[[]analysisResponse.CustomerIndicator]
func getCustomerCountByUser(c *gin.Context) {
	indicator, err := statisticsService.GetCustomerCountByUser()
	if err != nil {
		global.Logger.Error("业务员 - 客户数据指标获取异常", zap.Error(err))
		response.Fail(http.StatusBadRequest, "业务员 - 客户数据指标获取异常", c)
		return
	}
	response.Data[[]analysisResponse.CustomerIndicator](indicator, c)
}
