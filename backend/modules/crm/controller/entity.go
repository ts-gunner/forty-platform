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

type EntityRouter struct{}

func (EntityRouter) InitEntityRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/entity", moduleName))
	routerGroup.GET("/list", getEntityList)
	routerGroup.GET("/getByKey", getEntityByKey)
	routerGroup.GET("/detail", getEntityDetail)
	routerGroup.POST("/create", createEntity)
	routerGroup.POST("/update", updateEntity)
	routerGroup.POST("/delete", deleteEntity)
}

// @Tags CrmEntityController
// @ID getEntityList
// @Router /crm/entity/list [get]
// @Summary 获取客户实体列表
// @Produce json
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Param entityName query string false "实体名称" in:query
// @Param entityCode query string false "实体标识" in:query
// @Success 200 {object} response.ApiResult[response.PageResult[crmResponse.CrmEntityVo]]
func getEntityList(c *gin.Context) {
	var req request.GetEntityListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := entityService.GetCrmEntityList(req)
	if err != nil {
		global.Logger.Error("获取客户实体列表失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("获取客户实体列表失败: %v", err), c)
		return
	}

	response.Data[response.PageResult[crmResponse.CrmEntityVo]](*result, c)
}

// @Tags CrmEntityController
// @ID getEntityByKey
// @Router /crm/entity/getByKey [get]
// @Summary 根据key获取客户实体
// @Produce json
// @Param entityKey query string false "实体标识" in:query
// @Success 200 {object} response.ApiResult[crmResponse.CrmEntityVo]
func getEntityByKey(c *gin.Context) {
	var req request.GetEntityByKeyRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := entityService.GetEntityByCode(req.EntityKey)
	if err != nil {
		global.Logger.Error("获取客户实体失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("获取客户实体失败: %v", err), c)
		return
	}
	vo := crmResponse.CrmEntityVo{
		EntityId:    result.Id,
		EntityName:  result.EntityName,
		EntityCode:  result.EntityCode,
		Description: result.Description,
	}
	response.Data[crmResponse.CrmEntityVo](vo, c)
}

// @Tags CrmEntityController
// @ID getEntityDetail
// @Router /crm/entity/detail [get]
// @Summary 获取客户实体详情
// @Produce json
// @Param entityId query int true "实体ID" in:query
// @Success 200 {object} response.ApiResult[crmResponse.CrmEntityVo]
func getEntityDetail(c *gin.Context) {
	var req request.EntityDetailRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := entityService.GetEntityDetail(req.EntityId)
	if err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}
	response.Data[crmResponse.CrmEntityVo](*result, c)
}

// @Tags CrmEntityController
// @ID createEntity
// @Router /crm/entity/create [post]
// @Summary 创建客户实体
// @Accept json
// @Produce json
// @Param request body request.EntityCreateRequest true "创建实体参数"
// @Success 200 {object} response.ApiResult[any]
func createEntity(c *gin.Context) {
	var req request.EntityCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := entityService.CreateEntity(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags CrmEntityController
// @ID updateEntity
// @Router /crm/entity/update [post]
// @Summary 更新客户实体
// @Accept json
// @Produce json
// @Param request body request.EntityUpdateRequest true "更新实体参数"
// @Success 200 {object} response.ApiResult[any]
func updateEntity(c *gin.Context) {
	var req request.EntityUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := entityService.UpdateEntity(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags CrmEntityController
// @ID deleteEntity
// @Router /crm/entity/delete [post]
// @Summary 删除客户实体
// @Accept json
// @Produce json
// @Param request body request.EntityDeleteRequest true "删除实体参数"
// @Success 200 {object} response.ApiResult[any]
func deleteEntity(c *gin.Context) {
	var req request.EntityDeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := entityService.DeleteEntity(c.Request.Context(), req.EntityId); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}
