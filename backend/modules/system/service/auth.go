package service

import (
	"context"
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/response"
	"time"
)

type AuthService struct {
}

func (s *AuthService) CreateToken(user *entity.SysUser, key string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   user.UserId,
		"name": user.NickName,
	})
	signString, _ := token.SignedString([]byte(key))
	return signString
}

func (s *AuthService) AdminLogin(user *entity.SysUser) (*response.AdminUserVo, error) {
	userVo := response.AdminUserVo{}
	if err := copier.Copy(&userVo, user); err != nil {
		return nil, err
	}
	userVo.Token = s.CreateToken(user, constant.SALT)
	// 存入redis中
	ctx := context.TODO()
	userVoJson, _ := json.Marshal(userVo)
	global.Redis.Set(ctx, constant.REDIS_ADMIN_USER_TOKEN+userVo.Token, string(userVoJson), 24*time.Hour)
	return &userVo, nil
}
