package service

import (
	"errors"

	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"gorm.io/gorm"
)

type UserRoleRelService struct{}

func (UserRoleRelService) GetRolesByUserId(userId int64) ([]systemResponse.UserRoleRelVo, error) {
	var rels []entity.SysUserRoleRel
	if err := global.DB.Where("user_id = ?", userId).Find(&rels).Error; err != nil {
		return nil, err
	}

	if len(rels) == 0 {
		return []systemResponse.UserRoleRelVo{}, nil
	}

	roleIds := make([]int64, len(rels))
	for i, rel := range rels {
		roleIds[i] = rel.RoleId
	}

	var roles []entity.SysRole
	if err := global.DB.Where("role_id IN ? AND is_delete = ?", roleIds, 0).Find(&roles).Error; err != nil {
		return nil, err
	}

	result := make([]systemResponse.UserRoleRelVo, 0, len(roles))
	for _, role := range roles {
		result = append(result, systemResponse.UserRoleRelVo{
			RoleId:   role.RoleId,
			RoleName: role.RoleName,
			RoleKey:  role.RoleKey,
		})
	}

	return result, nil
}

func (UserRoleRelService) GetUsersByRoleId(roleId int64) ([]systemResponse.UserWithRoleVo, error) {
	var rels []entity.SysUserRoleRel
	if err := global.DB.Where("role_id = ?", roleId).Find(&rels).Error; err != nil {
		return nil, err
	}

	if len(rels) == 0 {
		return []systemResponse.UserWithRoleVo{}, nil
	}

	userIds := make([]int64, len(rels))
	for i, rel := range rels {
		userIds[i] = rel.UserId
	}

	var users []entity.SysUser
	if err := global.DB.Where("user_id IN ? AND is_delete = ?", userIds, 0).Find(&users).Error; err != nil {
		return nil, err
	}

	result := make([]systemResponse.UserWithRoleVo, 0, len(users))
	for _, user := range users {
		result = append(result, systemResponse.UserWithRoleVo{
			UserId:   user.UserId,
			Account:  user.Account,
			NickName: user.NickName,
		})
	}

	return result, nil
}

func (UserRoleRelService) AssignRolesToUser(req request.UserRoleRelAssignRequest) error {
	var user entity.SysUser
	if err := global.DB.Where("user_id = ? AND is_delete = ?", req.UserId, 0).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("用户不存在")
		}
		return err
	}

	var roles []entity.SysRole
	if err := global.DB.Where("role_id IN ? AND is_delete = ?", req.RoleIds, 0).Find(&roles).Error; err != nil {
		return err
	}
	if len(roles) != len(req.RoleIds) {
		return errors.New("部分角色不存在")
	}

	return global.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ?", req.UserId).Delete(&entity.SysUserRoleRel{}).Error; err != nil {
			return err
		}

		rels := make([]entity.SysUserRoleRel, len(req.RoleIds))
		for i, roleId := range req.RoleIds {
			rels[i] = entity.SysUserRoleRel{
				UserId: req.UserId,
				RoleId: roleId,
			}
		}

		if len(rels) > 0 {
			if err := tx.Create(&rels).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (UserRoleRelService) RemoveRoleFromUser(req request.UserRoleRelRemoveRequest) error {
	result := global.DB.Where("user_id = ? AND role_id = ?", req.UserId, req.RoleId).Delete(&entity.SysUserRoleRel{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("关联关系不存在")
	}
	return nil
}
