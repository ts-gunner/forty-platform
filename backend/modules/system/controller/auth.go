package controller

import (
	"fmt"
	"github.com/ts-gunner/forty-platform/common/constant"
	"net/http"
	"strconv"

	"github.com/jinzhu/copier"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"

	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response"
	"github.com/ts-gunner/forty-platform/common/utils"
	"go.uber.org/zap"
)

type AuthRouter struct{}

func (AuthRouter) InitAuthRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/auth", moduleName))
	routerGroup.POST("/adminPwdLogin", adminPwdLogin)
	routerGroup.GET("/getCurrentUser", getCurrentUser)
	routerGroup.POST("/wechatCrmLogin", wechatCrmLogin)
	routerGroup.POST("/approvalWechatAccess", approvalWechatAccess)
}

// @Tags SystemAuthController
// @ID adminPwdLogin
// @Router /system/auth/adminPwdLogin [post]
// @Summary 运营端账号密码登录
// @Accept json
// @Produce json
// @Param request body request.PwdLoginRequest true "密码登录参数"
// @Success 200 {object} response.ApiResult[string]
func adminPwdLogin(c *gin.Context) {
	var req request.PwdLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	user, _ := userService.GetSysUserByAccount(req.Username)
	if user == nil {
		response.Fail(http.StatusBadRequest, "用户不存在", c)
		return
	}
	if utils.EncryptBySM3(req.Password) != user.Password {
		response.Fail(http.StatusBadRequest, "密码错误", c)
		return
	}
	if user.Status == 0 {
		response.Fail(http.StatusBadRequest, "账号已停用", c)
		return
	}
	ok, err := global.Enforcer.HasGroupingPolicy(strconv.FormatInt(user.UserId, 10), constant.ROLE_ADMIN)

	if err != nil {
		global.Logger.Error(fmt.Sprintf("权限校验异常: %v", err))
		response.Fail(http.StatusBadRequest, "权限校验异常", c)
		return
	}
	if !ok {
		response.Fail(http.StatusForbidden, "没有权限登录管理端", c)
		return
	}

	if token, err := authService.AdminLogin(user); err != nil {
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("登录服务异常: %v", err), c)
		return
	} else {
		response.Data[string](token, c)
		return
	}
}

// @Tags SystemAuthController
// @ID wechatCrmLogin
// @Router /system/auth/wechatCrmLogin [post]
// @Summary 微信小程序客户系统一键登录
// @Accept json
// @Produce json
// @Param request body request.WechatCodeLoginRequest true "微信小程序一键登录登录参数"
// @Success 200 {object} response.ApiResult[string]
func wechatCrmLogin(c *gin.Context) {
	var req request.WechatCodeLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	token, err := authService.WechatCrmLogin(req.Code)
	if err != nil {
		response.Fail(http.StatusBadRequest, "账号异常:"+err.Error(), c)
		return
	}
	response.Data[string](token, c)
	return
}

// @Tags SystemAuthController
// @ID approvalWechatAccess
// @Router /system/auth/approvalWechatAccess [post]
// @Summary 提交访问微信小程序申请
// @Accept json
// @Produce json
// @Param request body request.ApprovalWechatAccessRequest true "请求参数"
// @Success 200 {object} response.ApiResult[any]
func approvalWechatAccess(c *gin.Context) {
	var req request.ApprovalWechatAccessRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := authService.ApprovalWechatAccess(req); err != nil {
		response.Fail(http.StatusBadRequest, "账号异常:"+err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags SystemAuthController
// @ID getCurrentUser
// @Router /system/auth/getCurrentUser [get]
// @Summary 获取当前登录用户
// @Produce json
// @Success 200 {object} response.ApiResult[systemResponse.LoginUserVo]
func getCurrentUser(c *gin.Context) {
	claims := utils.GetLoginUserInfo(c.Request.Context())
	vo := systemResponse.LoginUserVo{}
	if err := copier.Copy(&vo, &claims); err != nil {
		response.Fail(http.StatusBadRequest, "当前用户数据异常", c)
	}
	response.Data[systemResponse.LoginUserVo](vo, c)
}
