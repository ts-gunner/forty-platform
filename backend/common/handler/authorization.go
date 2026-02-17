package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/response"
	"net/http"
	"strings"
)

type AuthorizationConfig struct {
	ExcludePaths []string
	IncludePaths []string
}

// 身份验证
func IdentityVerification(config *AuthorizationConfig) gin.HandlerFunc {

	return func(c *gin.Context) {
		if config.ExcludePaths != nil && len(config.ExcludePaths) > 0 {
			for _, excludePath := range config.ExcludePaths {
				if strings.Contains(c.Request.URL.Path, excludePath) {
					c.Next()
					return
				}
			}
		}
		token := c.GetHeader("Authorization")
		if token == "" {
			c.Abort()
			response.Fail(http.StatusUnauthorized, "身份验证失败", c)
			return
		}
		_, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
			return []byte(constant.SALT), nil
		})
		if err != nil {
			global.Logger.Error(err.Error())
			c.Abort()
			response.Fail(http.StatusUnauthorized, "鉴权失败", c)
			return
		}
		c.Next()
	}
}
