package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	analysisRequest "github.com/ts-gunner/forty-platform/common/request/analysis"
	"github.com/ts-gunner/forty-platform/common/response"
	analysisResponse "github.com/ts-gunner/forty-platform/common/response/analysis"
	"go.uber.org/zap"
)

type StatisticsRouter struct{}

func (StatisticsRouter) InitStatisticsRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/analysis", moduleName))
	routerGroup.GET("/getBasicCount", getBasicCount)
	routerGroup.GET("/getCustomerCountByUser", getCustomerCountByUser)
	routerGroup.GET("/getCustomerTrendChart", getCustomerTrendChart)
	routerGroup.GET("/getCustomerTrendChartByUserId", getCustomerTrendChartByUserId)

}

// @Tags AnalysisController
// @ID getBasicCount
// @Router /analysis/analysis/getBasicCount [get]
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
// @Router /analysis/analysis/getCustomerCountByUser [get]
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

// @Tags AnalysisController
// @ID getCustomerTrendChart
// @Router /analysis/analysis/getCustomerTrendChart [get]
// @Summary 获取客户总数趋势图
// @Produce json
// @Success 200 {object} response.ApiResult[[]analysisResponse.CustomerTrendChart]
func getCustomerTrendChart(c *gin.Context) {
	indicator, err := statisticsService.GetCustomerTrendChart()
	if err != nil {
		global.Logger.Error("业务员 - 客户数据指标获取异常", zap.Error(err))
		response.Fail(http.StatusBadRequest, "业务员 - 客户数据指标获取异常", c)
		return
	}
	response.Data[[]analysisResponse.CustomerTrendChart](indicator, c)
}

// @Tags AnalysisController
// @ID getCustomerTrendChartByUserId
// @Router /analysis/analysis/getCustomerTrendChartByUserId [get]
// @Summary 根据用户id获取客户总数趋势图
// @Produce json
// @Param userId query string true "用户id" in:query
// @Success 200 {object} response.ApiResult[[]analysisResponse.CustomerTrendChart]
func getCustomerTrendChartByUserId(c *gin.Context) {
	var req analysisRequest.GetUserCrmTrendRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	indicator, err := statisticsService.GetCrmTrendChartByUserId(req.UserId)
	if err != nil {
		global.Logger.Error("获取指定业务员 - 客户数据指标获取异常", zap.Error(err))
		response.Fail(http.StatusBadRequest, "获取指定业务员 - 客户数据指标获取异常", c)
		return
	}
	response.Data[[]analysisResponse.CustomerTrendChart](indicator, c)
}
