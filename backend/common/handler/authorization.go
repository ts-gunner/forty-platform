package handler

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/response"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"gorm.io/gorm"
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
		claims := &systemResponse.LoginUserClaim{}
		_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(constant.SALT), nil
		})
		if err != nil {
			global.Logger.Error(err.Error())
			c.Abort()
			response.Fail(http.StatusUnauthorized, "鉴权失败", c)
			return
		}
		var user entity.SysUser
		if err := global.DB.Where("user_id = ?", claims.UserId).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.Abort()
				response.Fail(http.StatusUnauthorized, "用户不存在", c)
				return
			}
		}
		if user.Status != 1 {
			c.Abort()
			response.Fail(http.StatusUnauthorized, "用户已停用", c)
			return
		}
		newCtx := context.WithValue(c.Request.Context(), constant.USER_KEY, claims)
		c.Request = c.Request.WithContext(newCtx)
		c.Next()
	}
}
