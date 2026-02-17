package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/request"
	"github.com/ts-gunner/forty-platform/common/response"
	"github.com/ts-gunner/forty-platform/common/utils"
	"go.uber.org/zap"
	"net/http"
)

type AuthRouter struct{}

func (AuthRouter) InitAuthRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/auth", moduleName))
	routerGroup.POST("/adminPwdLogin", adminPwdLogin)
}

// @Tags authController
// @ID adminPwdLogin
// @Router /system/auth/adminPwdLogin [post]
// @Summary 运营端账号密码登录
// @Accept json
// @Produce json
// @Param request body request.PwdLoginRequest true "密码登录参数"
// @Success 200 {object} response.ApiResult[response.AdminUserVo]
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

	if vo, err := authService.AdminLogin(user); err != nil {
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("登录服务异常: %v", err), c)
		return
	} else {
		response.Data[response.AdminUserVo](*vo, c)
		return
	}
}
