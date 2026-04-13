package service

import (
	"fmt"
	"github.com/ts-gunner/forty-platform/common/storage"
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
		return "", fmt.Errorf("非内部人员，请申请且审批通过后再使用")
	}
	if sysUser.Status != 1 {
		return "", fmt.Errorf("用户账号不可用，请联系管理员")
	}
	if err := copier.Copy(&claim, sysUser); err != nil {
		return "", err
	}
	if sysUser.AvatarId != 0 {
		resource, err := resourceMapper.GetResourceById(global.DB, sysUser.AvatarId)
		if err != nil {
			return "", err
		}

		policy, err := storage.GetPolicyByMode(global.Store, storage.StorageMode(resource.StorageType))
		if err != nil {
			return "", err
		}
		url, err := policy.GetAccessUrl(storage.StorageVo{
			RelativePath: resource.RelPath,
			DirectUrl:    resource.PreviewUrl,
		})
		if err != nil {
			return "", err
		}
		claim.Avatar = url
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
