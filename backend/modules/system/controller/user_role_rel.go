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

type UserRoleRelRouter struct{}

func (UserRoleRelRouter) InitUserRoleRelRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/userRoleRel", moduleName))
	routerGroup.GET("/listByUser", getRolesByUserId)
	routerGroup.GET("/listByRole", getUsersByRoleId)
	routerGroup.POST("/assign", assignRolesToUser)
	routerGroup.DELETE("/remove", removeRoleFromUser)
}

// @Tags userRoleRelController
// @ID getRolesByUserId
// @Router /system/userRoleRel/listByUser [get]
// @Summary 根据用户ID获取角色列表
// @Produce json
// @Param userId query string true "用户ID" in:query
// @Success 200 {object} response.ApiResult[[]systemResponse.UserRoleRelVo]
func getRolesByUserId(c *gin.Context) {
	var req request.UserRoleRelListByUserRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := userRoleRelService.GetRolesByUserId(req.UserId)
	if err != nil {
		global.Logger.Error("获取用户角色列表失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取用户角色列表失败: %v", err), c)
		return
	}

	response.Data[[]systemResponse.UserRoleRelVo](result, c)
}

// @Tags userRoleRelController
// @ID getUsersByRoleId
// @Router /system/userRoleRel/listByRole [get]
// @Summary 根据角色ID获取用户列表
// @Produce json
// @Param roleId query string true "角色ID" in:query
// @Success 200 {object} response.ApiResult[[]systemResponse.UserWithRoleVo]
func getUsersByRoleId(c *gin.Context) {
	var req request.UserRoleRelListByRoleRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := userRoleRelService.GetUsersByRoleId(req.RoleId)
	if err != nil {
		global.Logger.Error("获取角色用户列表失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取角色用户列表失败: %v", err), c)
		return
	}

	response.Data[[]systemResponse.UserWithRoleVo](result, c)
}

// @Tags userRoleRelController
// @ID assignRolesToUser
// @Router /system/userRoleRel/assign [post]
// @Summary 为用户分配角色
// @Accept json
// @Produce json
// @Param request body request.UserRoleRelAssignRequest true "分配角色参数"
// @Success 200 {object} response.ApiResult[any]
func assignRolesToUser(c *gin.Context) {
	var req request.UserRoleRelAssignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := userRoleRelService.AssignRolesToUser(req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags userRoleRelController
// @ID removeRoleFromUser
// @Router /system/userRoleRel/remove [delete]
// @Summary 移除用户的角色
// @Accept json
// @Produce json
// @Param request body request.UserRoleRelRemoveRequest true "移除角色参数"
// @Success 200 {object} response.ApiResult[any]
func removeRoleFromUser(c *gin.Context) {
	var req request.UserRoleRelRemoveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := userRoleRelService.RemoveRoleFromUser(req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}
