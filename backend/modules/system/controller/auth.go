package controller

import (
	"fmt"
	"github.com/jinzhu/copier"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"net/http"

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
}

// @Tags authController
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

	if token, err := authService.AdminLogin(user); err != nil {
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("登录服务异常: %v", err), c)
		return
	} else {
		response.Data[string](token, c)
		return
	}
}

// @Tags authController
// @ID getCurrentUser
// @Router /system/auth/getCurrentUser [get]
// @Summary 运营端获取当前用户
// @Produce json
// @Success 200 {object} response.ApiResult[systemResponse.AdminLoginUserVo]
func getCurrentUser(c *gin.Context) {
	claims := utils.GetLoginUserInfo(c.Request.Context())
	vo := systemResponse.AdminLoginUserVo{}
	if err := copier.Copy(&vo, &claims); err != nil {
		response.Fail(http.StatusBadRequest, "当前用户数据异常", c)
	}
	response.Data[systemResponse.AdminLoginUserVo](vo, c)
}
