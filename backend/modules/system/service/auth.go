package service

import (
	"context"
	"encoding/json"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
)

type AuthService struct {
}

func (s *AuthService) CreateToken(claim *systemResponse.AdminUserClaim, key string) string {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	signString, _ := token.SignedString([]byte(key))
	return signString
}

func (s *AuthService) AdminLogin(user *entity.SysUser) (string, error) {
	claim := &systemResponse.AdminUserClaim{}
	if err := copier.Copy(&claim, user); err != nil {
		return "", err
	}

	token := s.CreateToken(claim, constant.SALT)
	ctx := context.TODO()
	userVoJson, _ := json.Marshal(claim)
	global.Redis.Set(ctx, constant.REDIS_ADMIN_USER_TOKEN+token, string(userVoJson), 24*time.Hour)
	return token, nil
}
