package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"go.uber.org/zap"
)

type CustomerFavoriteRouter struct{}

func (CustomerFavoriteRouter) InitCustomerFavoriteRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/favorite", moduleName))
	routerGroup.POST("/add", addCustomerFavorite)
	routerGroup.POST("/remove", removeCustomerFavorite)
	routerGroup.GET("/list", getCustomerFavoriteList)
	routerGroup.GET("/check", checkCustomerFavorite)
}

// @Tags CrmCustomerFavoriteController
// @ID addCustomerFavorite
// @Router /crm/favorite/add [post]
// @Summary 添加客户信息收藏
// @Accept json
// @Produce json
// @Param request body request.AddCustomerFavoriteRequest true "添加收藏参数"
// @Success 200 {object} response.ApiResult[any]
func addCustomerFavorite(c *gin.Context) {
	var req request.AddCustomerFavoriteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	err := customerFavoriteService.AddFavorite(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("添加收藏失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("添加收藏失败: %v", err), c)
		return
	}

	response.Ok(c)
}

// @Tags CrmCustomerFavoriteController
// @ID removeCustomerFavorite
// @Router /crm/favorite/remove [post]
// @Summary 取消客户信息收藏
// @Accept json
// @Produce json
// @Param request body request.RemoveCustomerFavoriteRequest true "取消收藏参数"
// @Success 200 {object} response.ApiResult[any]
func removeCustomerFavorite(c *gin.Context) {
	var req request.RemoveCustomerFavoriteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	err := customerFavoriteService.RemoveFavorite(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("取消收藏失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("取消收藏失败: %v", err), c)
		return
	}

	response.Ok(c)
}

// @Tags CrmCustomerFavoriteController
// @ID getCustomerFavoriteList
// @Router /crm/favorite/list [get]
// @Summary 获取收藏列表
// @Produce json
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Param entityId query string false "实体表id" in:query
// @Success 200 {object} response.ApiResult[response.PageResult[crmResponse.CrmCustomerFavoriteVo]]
func getCustomerFavoriteList(c *gin.Context) {
	var req request.GetCustomerFavoriteListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := customerFavoriteService.GetFavoriteList(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("获取收藏列表失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("获取收藏列表失败: %v", err), c)
		return
	}

	response.Data[response.PageResult[crmResponse.CrmCustomerFavoriteVo]](*result, c)
}

// @Tags CrmCustomerFavoriteController
// @ID checkCustomerFavorite
// @Router /crm/favorite/check [get]
// @Summary 检查是否已收藏
// @Produce json
// @Param entityId query string true "实体表id" in:query
// @Param valueId query string true "数据id" in:query
// @Success 200 {object} response.ApiResult[bool]
func checkCustomerFavorite(c *gin.Context) {
	var req request.CheckCustomerFavoriteRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	isFavorite, err := customerFavoriteService.CheckFavorite(c.Request.Context(), req.EntityId, req.ValueId)
	if err != nil {
		global.Logger.Error("检查收藏状态失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("检查收藏状态失败: %v", err), c)
		return
	}

	response.Data[bool](isFavorite, c)
}
