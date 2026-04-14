package task

import (
	"context"
	"github.com/samber/lo"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/modules/system/mapper"
	"github.com/ts-gunner/forty-platform/modules/system/service"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// 定时任务 - 添加角色 -> 微信CRM用户
func AddCrmRole() {
	ctx := context.Background()
	openId, err := global.Redis.LPop(ctx, string(constant.AUDIT_ACCESS_CRM)).Result()

	// 没有数据
	if err != nil {
		return
	}
	err = global.DB.Transaction(func(tx *gorm.DB) error {
		var user entity.SysUser
		if err = tx.Model(user).Where("openid = ? and is_delete = 0", openId).First(&user).Error; err != nil && err != gorm.ErrRecordNotFound {
			return err
		}
		// 获取该用户的角色列表
		roleList, err := service.SystemService.GetRolesByUserId(user.UserId)
		if err != nil {
			return err
		}
		roleIds := lo.Map(roleList, func(role system.UserRoleRelVo, idx int) int64 {
			return role.RoleId
		})
		// 找到对应的id
		role, err := mapper.SystemMapper.RoleMapper.GetRoleByRoleKey(tx, constant.ROLE_WECHAT_CRM)
		if err != nil {
			return err
		}
		roleIds = append(roleIds, role.RoleId)
		// 去重
		roleIds = lo.Uniq(roleIds)
		// 授权角色
		if err = service.SystemService.AssignRolesToUser(tx, request.UserRoleRelAssignRequest{
			UserId:  user.UserId,
			RoleIds: roleIds,
		}); err != nil {
			return err
		}
		global.Logger.Info("定时任务 - AddCrmRole完成", zap.Any("user", map[string]any{
			"openId":   user.OpenId,
			"nickName": user.NickName,
		}))

		return nil
	})
	if err != nil {
		global.Logger.Error("定时任务 - AddCrmRole发生错误", zap.Error(err))
		//global.Redis.RPush(ctx, string(constant.AUDIT_ACCESS_CRM), openId)

	}
}
