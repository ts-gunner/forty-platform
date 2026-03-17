package mapper

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"gorm.io/gorm"
)

type RoleMapper struct{}

func (RoleMapper) GetRoleByRoleKey(tx *gorm.DB, roleKey string) (*entity.SysRole, error) {
	var role entity.SysRole
	if err := tx.Where("role_key = ? and is_delete=0", roleKey).Find(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

/*
*
根据用户id获取角色列表
*/
func (RoleMapper) GetRoleListByUserId(tx *gorm.DB, userId int64) ([]entity.SysRole, error) {
	var roleList []entity.SysRole
	if err := tx.Table("sys_role").Where(
		"role_id in (SELECT role_id FROM sys_user_role_rel WHERE sys_user_role_rel.user_id = ?)",
		userId,
	).Find(&roleList).Error; err != nil {
		return nil, err
	}
	return roleList, nil
}
