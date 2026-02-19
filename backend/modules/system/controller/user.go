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

type UserRouter struct{}

func (UserRouter) InitUserRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/user", moduleName))
	routerGroup.GET("/list", getUserList)
	routerGroup.GET("/detail", getUserDetail)
	routerGroup.POST("/create", createUser)
	routerGroup.PUT("/update", updateUser)
	routerGroup.PUT("/updatePwd", updatePassword)
	routerGroup.DELETE("/delete", deleteUser)
}

// @Tags userController
// @ID getUserList
// @Router /system/user/list [get]
// @Summary 获取用户列表
// @Produce json
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Param account query string false "账号" in:query
// @Param nickName query string false "昵称" in:query
// @Param phone query string false "手机号" in:query
// @Param status query int false "状态" in:query
// @Success 200 {object} response.ApiResult[response.PageResult[systemResponse.UserVo]]
func getUserList(c *gin.Context) {
	var req request.UserListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := userService.GetUserList(req)
	if err != nil {
		global.Logger.Error("获取用户列表失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取用户列表失败: %v", err), c)
		return
	}

	response.Data[response.PageResult[systemResponse.UserVo]](*result, c)
}

// @Tags userController
// @ID getUserDetail
// @Router /system/user/detail [get]
// @Summary 获取用户详情
// @Produce json
// @Param userId query string true "用户ID" in:query
// @Success 200 {object} response.ApiResult[systemResponse.UserVo]
func getUserDetail(c *gin.Context) {
	var req request.UserDetailRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := userService.GetUserDetail(req.UserId)
	if err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Data[systemResponse.UserVo](*result, c)
}

// @Tags userController
// @ID createUser
// @Router /system/user/create [post]
// @Summary 创建用户
// @Accept json
// @Produce json
// @Param request body request.UserCreateRequest true "创建用户参数"
// @Success 200 {object} response.ApiResult[any]
func createUser(c *gin.Context) {
	ctx := c.Request.Context()
	var req request.UserCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := userService.CreateUser(ctx, req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags userController
// @ID updateUser
// @Router /system/user/update [put]
// @Summary 更新用户
// @Accept json
// @Produce json
// @Param request body request.UserUpdateRequest true "更新用户参数"
// @Success 200 {object} response.ApiResult[any]
func updateUser(c *gin.Context) {
	var req request.UserUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := userService.UpdateUser(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags userController
// @ID updatePassword
// @Router /system/user/resetPwd [put]
// @Summary 重置密码
// @Accept json
// @Produce json
// @Param request body request.UserResetPwdRequest true "修改密码参数"
// @Success 200 {object} response.ApiResult[any]
func updatePassword(c *gin.Context) {
	var req request.UserResetPwdRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := userService.ResetPassword(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags userController
// @ID deleteUser
// @Router /system/user/delete [delete]
// @Summary 删除用户
// @Accept json
// @Produce json
// @Param request body request.UserDeleteRequest true "删除用户参数"
// @Success 200 {object} response.ApiResult[any]
func deleteUser(c *gin.Context) {
	var req request.UserDeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := userService.DeleteUser(c.Request.Context(), req.UserId); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}
