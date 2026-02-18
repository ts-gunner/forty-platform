package service

import (
	"errors"

	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"gorm.io/gorm"
)

type RolePermissionRelService struct{}

func (RolePermissionRelService) GetPermissionsByRoleId(roleId int64) ([]systemResponse.RolePermissionRelVo, error) {
	var rels []entity.SysRolePermissionRel
	if err := global.DB.Where("role_id = ?", roleId).Find(&rels).Error; err != nil {
		return nil, err
	}

	if len(rels) == 0 {
		return []systemResponse.RolePermissionRelVo{}, nil
	}

	permissionIds := make([]int64, len(rels))
	for i, rel := range rels {
		permissionIds[i] = rel.PermissionId
	}

	var permissions []entity.SysPermission
	if err := global.DB.Where("permission_id IN ? AND is_delete = ?", permissionIds, 0).Find(&permissions).Error; err != nil {
		return nil, err
	}

	result := make([]systemResponse.RolePermissionRelVo, 0, len(permissions))
	for _, perm := range permissions {
		result = append(result, systemResponse.RolePermissionRelVo{
			PermissionId:   perm.PermissionId,
			PermissionName: perm.PermissionName,
			Type:           perm.Type,
			Perms:          perm.Perms,
		})
	}

	return result, nil
}

func (RolePermissionRelService) GetRolesByPermissionId(permissionId int64) ([]systemResponse.RoleWithPermissionVo, error) {
	var rels []entity.SysRolePermissionRel
	if err := global.DB.Where("permission_id = ?", permissionId).Find(&rels).Error; err != nil {
		return nil, err
	}

	if len(rels) == 0 {
		return []systemResponse.RoleWithPermissionVo{}, nil
	}

	roleIds := make([]int64, len(rels))
	for i, rel := range rels {
		roleIds[i] = rel.RoleId
	}

	var roles []entity.SysRole
	if err := global.DB.Where("role_id IN ? AND is_delete = ?", roleIds, 0).Find(&roles).Error; err != nil {
		return nil, err
	}

	result := make([]systemResponse.RoleWithPermissionVo, 0, len(roles))
	for _, role := range roles {
		result = append(result, systemResponse.RoleWithPermissionVo{
			RoleId:   role.RoleId,
			RoleName: role.RoleName,
			RoleKey:  role.RoleKey,
		})
	}

	return result, nil
}

func (RolePermissionRelService) AssignPermissionsToRole(req request.RolePermissionRelAssignRequest) error {
	var role entity.SysRole
	if err := global.DB.Where("role_id = ? AND is_delete = ?", req.RoleId, 0).First(&role).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("角色不存在")
		}
		return err
	}

	var permissions []entity.SysPermission
	if err := global.DB.Where("permission_id IN ? AND is_delete = ?", req.PermissionIds, 0).Find(&permissions).Error; err != nil {
		return err
	}
	if len(permissions) != len(req.PermissionIds) {
		return errors.New("部分权限不存在")
	}

	return global.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("role_id = ?", req.RoleId).Delete(&entity.SysRolePermissionRel{}).Error; err != nil {
			return err
		}

		rels := make([]entity.SysRolePermissionRel, len(req.PermissionIds))
		for i, permId := range req.PermissionIds {
			rels[i] = entity.SysRolePermissionRel{
				RoleId:       req.RoleId,
				PermissionId: permId,
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

func (RolePermissionRelService) RemovePermissionFromRole(req request.RolePermissionRelRemoveRequest) error {
	result := global.DB.Where("role_id = ? AND permission_id = ?", req.RoleId, req.PermissionId).Delete(&entity.SysRolePermissionRel{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("关联关系不存在")
	}
	return nil
}
