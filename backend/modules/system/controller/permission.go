package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"go.uber.org/zap"
)

type PermissionRouter struct{}

func (PermissionRouter) InitPermissionRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/permission", moduleName))
	routerGroup.GET("/list", getPermissionList)
	routerGroup.GET("/detail", getPermissionDetail)
	routerGroup.POST("/create", createPermission)
	routerGroup.PUT("/update", updatePermission)
	routerGroup.DELETE("/delete", deletePermission)
}

// @Tags permissionController
// @ID getPermissionList
// @Router /system/permission/list [get]
// @Summary 获取权限列表
// @Produce json
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Param permissionName query string false "权限名称" in:query
// @Param type query int false "类型" in:query
// @Param perms query string false "权限标识" in:query
// @Success 200 {object} response.ApiResult[response.PageResult[systemResponse.PermissionVo]]
func getPermissionList(c *gin.Context) {
	var req request.PermissionListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := permissionService.GetPermissionList(req)
	if err != nil {
		global.Logger.Error("获取权限列表失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取权限列表失败: %v", err), c)
		return
	}

	response.Data[response.PageResult[systemResponse.PermissionVo]](*result, c)
}

// @Tags permissionController
// @ID getPermissionDetail
// @Router /system/permission/detail [get]
// @Summary 获取权限详情
// @Produce json
// @Param permissionId query int true "权限ID" in:query
// @Success 200 {object} response.ApiResult[systemResponse.PermissionVo]
func getPermissionDetail(c *gin.Context) {
	var req request.PermissionDetailRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := permissionService.GetPermissionDetail(req.PermissionId)
	if err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Data[systemResponse.PermissionVo](*result, c)
}

// @Tags permissionController
// @ID createPermission
// @Router /system/permission/create [post]
// @Summary 创建权限
// @Accept json
// @Produce json
// @Param request body request.PermissionCreateRequest true "创建权限参数"
// @Success 200 {object} response.ApiResult[any]
func createPermission(c *gin.Context) {
	var req request.PermissionCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := permissionService.CreatePermission(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags permissionController
// @ID updatePermission
// @Router /system/permission/update [put]
// @Summary 更新权限
// @Accept json
// @Produce json
// @Param request body request.PermissionUpdateRequest true "更新权限参数"
// @Success 200 {object} response.ApiResult[any]
func updatePermission(c *gin.Context) {
	var req request.PermissionUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := permissionService.UpdatePermission(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags permissionController
// @ID deletePermission
// @Router /system/permission/delete [delete]
// @Summary 删除权限
// @Accept json
// @Produce json
// @Param request body request.PermissionDeleteRequest true "删除权限参数"
// @Success 200 {object} response.ApiResult[any]
func deletePermission(c *gin.Context) {
	var req request.PermissionDeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := permissionService.DeletePermission(c.Request.Context(), req.PermissionId); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}
