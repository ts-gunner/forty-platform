package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/models"
	"github.com/ts-gunner/forty-platform/common/response"
	"github.com/ts-gunner/forty-platform/common/utils"
	"go.uber.org/zap"
	"net/http"
	"strconv"
)

func RoleCheckHandlerFunc() gin.HandlerFunc {
	urls := lo.Map(constant.CASBIN_INIT_MAP, func(rule models.CasbinRule, idx int) string {
		return rule.Object
	})
	return func(c *gin.Context) {
		check := false
		for _, p := range urls {
			if c.Request.URL.Path == p {
				check = true
			}
		}
		if !check {
			c.Next()
			return
		}
		user := utils.GetLoginUserInfo(c.Request.Context())
		ok, err := global.Enforcer.Enforce(strconv.FormatInt(user.UserId, 10), c.Request.URL.Path, c.Request.Method)
		if err != nil {
			c.Abort()
			global.Logger.Error("权限校验异常", zap.Error(err))
			response.Fail(http.StatusForbidden, "权限校验异常", c)
			return
		}
		if !ok {
			c.Abort()
			response.Fail(http.StatusForbidden, "无权限访问", c)
			return
		}
		c.Next()
	}
}
