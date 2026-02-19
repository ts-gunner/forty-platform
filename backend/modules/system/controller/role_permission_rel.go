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

type RolePermissionRelRouter struct{}

func (RolePermissionRelRouter) InitRolePermissionRelRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/rolePermissionRel", moduleName))
	routerGroup.GET("/listByRole", getPermissionsByRoleId)
	routerGroup.GET("/listByPermission", getRolesByPermissionId)
	routerGroup.POST("/assign", assignPermissionsToRole)
	routerGroup.DELETE("/remove", removePermissionFromRole)
}

// @Tags rolePermissionRelController
// @ID getPermissionsByRoleId
// @Router /system/rolePermissionRel/listByRole [get]
// @Summary 根据角色ID获取权限列表
// @Produce json
// @Param roleId query string true "角色ID" in:query
// @Success 200 {object} response.ApiResult[[]systemResponse.RolePermissionRelVo]
func getPermissionsByRoleId(c *gin.Context) {
	var req request.RolePermissionRelListByRoleRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := rolePermissionRelService.GetPermissionsByRoleId(req.RoleId)
	if err != nil {
		global.Logger.Error("获取角色权限列表失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取角色权限列表失败: %v", err), c)
		return
	}

	response.Data[[]systemResponse.RolePermissionRelVo](result, c)
}

// @Tags rolePermissionRelController
// @ID getRolesByPermissionId
// @Router /system/rolePermissionRel/listByPermission [get]
// @Summary 根据权限ID获取角色列表
// @Produce json
// @Param permissionId query string true "权限ID" in:query
// @Success 200 {object} response.ApiResult[[]systemResponse.RoleWithPermissionVo]
func getRolesByPermissionId(c *gin.Context) {
	var req request.RolePermissionRelListByPermissionRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := rolePermissionRelService.GetRolesByPermissionId(req.PermissionId)
	if err != nil {
		global.Logger.Error("获取权限角色列表失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取权限角色列表失败: %v", err), c)
		return
	}

	response.Data[[]systemResponse.RoleWithPermissionVo](result, c)
}

// @Tags rolePermissionRelController
// @ID assignPermissionsToRole
// @Router /system/rolePermissionRel/assign [post]
// @Summary 为角色分配权限
// @Accept json
// @Produce json
// @Param request body request.RolePermissionRelAssignRequest true "分配权限参数"
// @Success 200 {object} response.ApiResult[any]
func assignPermissionsToRole(c *gin.Context) {
	var req request.RolePermissionRelAssignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := rolePermissionRelService.AssignPermissionsToRole(req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags rolePermissionRelController
// @ID removePermissionFromRole
// @Router /system/rolePermissionRel/remove [delete]
// @Summary 移除角色的权限
// @Accept json
// @Produce json
// @Param request body request.RolePermissionRelRemoveRequest true "移除权限参数"
// @Success 200 {object} response.ApiResult[any]
func removePermissionFromRole(c *gin.Context) {
	var req request.RolePermissionRelRemoveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := rolePermissionRelService.RemovePermissionFromRole(req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}
