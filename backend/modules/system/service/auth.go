package service

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
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
	return token, nil
}

func (s *AuthService) WechatMiniProgramLogin(openId string) (string, error) {

	var sysUser entity.SysUser
	if err := global.DB.Where(map[string]any{
		"openid":    openId,
		"is_delete": 0,
	}).First(&sysUser).Error; err != nil && err != gorm.ErrRecordNotFound {
		return "", err
	}
	claim := &systemResponse.AdminUserClaim{}
	if sysUser.UserId == 0 {
		// 创建用户
		userId, _ := global.IdCreator.NextID()
		user := entity.SysUser{
			UserId:   userId,
			Account:  "openid_" + openId,
			Password: utils.EncryptBySM3(constant.INIT_PASSWORD),
			NickName: "微信用户",
			OpenId:   openId,
			Phone:    "",
			Email:    "",
			AvatarId: "",
			Status:   1,
			BaseRecordField: entity.BaseRecordField{
				CreatorId: 0,
			},
		}
		if err := global.DB.Create(&user).Error; err != nil {
			global.Logger.Error("微信小程序 - 用户创建失败：" + err.Error())
			return "", errors.New("用户创建失败")
		}
		if err := copier.Copy(&claim, user); err != nil {
			return "", err
		}

	} else {
		if sysUser.Status != 1 {
			return "", errors.New("用户账号不可用，请联系管理员")
		}
		if err := copier.Copy(&claim, sysUser); err != nil {
			return "", err
		}
	}

	token := s.CreateToken(claim, constant.SALT)
	return token, nil
}
