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

type RoleRouter struct{}

func (RoleRouter) InitRoleRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/role", moduleName))
	routerGroup.GET("/list", getRoleList)
	routerGroup.GET("/detail", getRoleDetail)
	routerGroup.POST("/create", createRole)
	routerGroup.PUT("/update", updateRole)
	routerGroup.DELETE("/delete", deleteRole)
}

// @Tags roleController
// @ID getRoleList
// @Router /system/role/list [get]
// @Summary 获取角色列表
// @Produce json
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Param roleName query string false "角色名称" in:query
// @Param roleKey query string false "角色标识" in:query
// @Success 200 {object} response.ApiResult[response.PageResult[systemResponse.RoleVo]]
func getRoleList(c *gin.Context) {
	var req request.RoleListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := roleService.GetRoleList(req)
	if err != nil {
		global.Logger.Error("获取角色列表失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取角色列表失败: %v", err), c)
		return
	}

	response.Data[response.PageResult[systemResponse.RoleVo]](*result, c)
}

// @Tags roleController
// @ID getRoleDetail
// @Router /system/role/detail [get]
// @Summary 获取角色详情
// @Produce json
// @Param roleId query int true "角色ID" in:query
// @Success 200 {object} response.ApiResult[systemResponse.RoleVo]
func getRoleDetail(c *gin.Context) {
	var req request.RoleDetailRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := roleService.GetRoleDetail(req.RoleId)
	if err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Data[systemResponse.RoleVo](*result, c)
}

// @Tags roleController
// @ID createRole
// @Router /system/role/create [post]
// @Summary 创建角色
// @Accept json
// @Produce json
// @Param request body request.RoleCreateRequest true "创建角色参数"
// @Success 200 {object} response.ApiResult[any]
func createRole(c *gin.Context) {
	var req request.RoleCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := roleService.CreateRole(req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags roleController
// @ID updateRole
// @Router /system/role/update [put]
// @Summary 更新角色
// @Accept json
// @Produce json
// @Param request body request.RoleUpdateRequest true "更新角色参数"
// @Success 200 {object} response.ApiResult[any]
func updateRole(c *gin.Context) {
	var req request.RoleUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := roleService.UpdateRole(req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags roleController
// @ID deleteRole
// @Router /system/role/delete [delete]
// @Summary 删除角色
// @Accept json
// @Produce json
// @Param request body request.RoleDeleteRequest true "删除角色参数"
// @Success 200 {object} response.ApiResult[any]
func deleteRole(c *gin.Context) {
	var req request.RoleDeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := roleService.DeleteRole(req.RoleId); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}
