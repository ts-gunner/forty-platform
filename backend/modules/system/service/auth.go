package service

import (
	"errors"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/copier"
	"github.com/samber/lo"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type AuthService struct {
}

func (s *AuthService) AdminLogin(user *entity.SysUser) (string, error) {
	claim := &systemResponse.LoginUserClaim{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}
	if err := copier.Copy(&claim, user); err != nil {
		return "", err
	}
	roleList, err := roleMapper.GetRoleListByUserId(global.DB, claim.UserId)
	if err != nil {
		return "", err
	}
	roleKeys := lo.Map(roleList, func(item entity.SysRole, idx int) string {
		return item.RoleKey
	})
	claim.RoleIds = strings.Join(roleKeys, ",")
	token := utils.CreateToken(claim, constant.SALT)
	return token, nil
}

func (s *AuthService) WechatCrmLogin(code string) (string, error) {
	// 调用官方地址拿取openid
	openId, err := utils.GetWechatOpenidByCode(
		global.Config.Wechat.Appid,
		global.Config.Wechat.Appsecret,
		code,
	)

	if err != nil {
		return "", err
	}
	var sysUser entity.SysUser
	if err := global.DB.Where(map[string]any{
		"openid":    openId,
		"is_delete": 0,
	}).First(&sysUser).Error; err != nil && err != gorm.ErrRecordNotFound {
		return "", err
	}
	claim := &systemResponse.LoginUserClaim{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}
	if sysUser.UserId == 0 {
		userId, _ := global.IdCreator.NextID()
		user := entity.SysUser{
			UserId:   userId,
			Account:  "openid_" + lo.RandomString(5, lo.LettersCharset),
			Password: utils.EncryptBySM3(constant.INIT_PASSWORD),
			NickName: "微信用户",
			OpenId:   openId,
			Phone:    "",
			Email:    "",
			AvatarId: 0,
			Status:   1,
			BaseRecordField: entity.BaseRecordField{
				CreatorId: 0,
			},
		}
		if err := global.DB.Transaction(func(tx *gorm.DB) error {
			// 创建用户
			if err := tx.Create(&user).Error; err != nil {
				global.Logger.Error("微信小程序 - 用户创建失败：" + err.Error())
				return errors.New("用户创建失败")
			}

			role, err := roleMapper.GetRoleByRoleKey(tx, constant.ROLE_WECHAT_CRM)
			if err != nil {
				return err
			}
			// 绑定用户跟微信小程序角色
			rel := &entity.SysUserRoleRel{
				UserId: userId,
				RoleId: role.RoleId,
			}
			if err := tx.Create(rel).Error; err != nil {
				global.Logger.Error("微信小程序 - 用户角色绑定失败：" + err.Error())
				return errors.New("用户角色绑失败")
			}
			return nil

		}); err != nil {
			return "", err
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
	roleList, err := roleMapper.GetRoleListByUserId(global.DB, claim.UserId)
	if err != nil {
		return "", err
	}
	roleKeys := lo.Map(roleList, func(item entity.SysRole, idx int) string {
		return item.RoleKey
	})
	claim.RoleIds = strings.Join(roleKeys, ",")
	token := utils.CreateToken(claim, constant.SALT)
	return token, nil
}
