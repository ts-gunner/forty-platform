package service

import (
	"fmt"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/storage"
	"strconv"
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
	ok, err := global.Enforcer.HasGroupingPolicy(strconv.FormatInt(sysUser.UserId, 10), constant.ROLE_WECHAT_CRM)

	if err != nil {
		global.Logger.Error(fmt.Sprintf("权限校验异常: %v", err))
		return "", fmt.Errorf("权限校验异常")
	}
	if !ok {
		return "", fmt.Errorf("没有权限登录管理端")
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

func (AuthService) ApprovalWechatAccess(req request.ApprovalWechatAccessRequest) error {
	// 1. 根据微信code获取用户openid
	openId, err := utils.GetWechatOpenidByCode(
		global.Config.Wechat.Appid,
		global.Config.Wechat.Appsecret,
		req.LoginCode,
	)
	if err != nil {
		return err
	}
	// 2. 查找用户是否存在
	var sysUser entity.SysUser
	err = global.DB.Where(map[string]any{
		"openid":    openId,
		"is_delete": 0,
	}).First(&sysUser).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return err
	}
	if err == gorm.ErrRecordNotFound {
		// 不存在 -> 添加用户
		userId, _ := global.IdCreator.NextID()
		sysUser = entity.SysUser{
			UserId:   userId,
			Account:  "crm_" + lo.RandomString(5, lo.LettersCharset),
			Password: utils.EncryptBySM3(constant.INIT_PASSWORD),
			OpenId:   openId,
			NickName: req.AuditName,
			Phone:    "",
			Email:    "",
			AvatarId: 0,
			Status:   1,
			BaseRecordField: entity.BaseRecordField{
				CreatorId: 0,
			},
		}
		if err := global.DB.Create(&sysUser).Error; err != nil {
			return fmt.Errorf("存储用户失败")
		}
	}
	// 4. 创建审核记录
	record := entity.AuditAccessRecord{
		BizType:     string(constant.AUDIT_ACCESS_CRM),
		BizDesc:     constant.AUDIT_BIZ_MAP[constant.AUDIT_ACCESS_CRM],
		AuditCode:   req.AuditCode,
		ApplyUser:   req.AuditName,
		ApplyRemark: req.AuditRemark,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: 0,
		},
	}
	return global.DB.Save(&record).Error
}
