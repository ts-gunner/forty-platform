package mapper

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"gorm.io/gorm"
)

type SysUserMapper struct{}

func (SysUserMapper) GetUserById(tx *gorm.DB, userId int64) (*entity.SysUser, error) {
	var user *entity.SysUser
	if err := tx.Model(&entity.SysUser{}).Where("user_id = ? and is_delete = 0", userId).First(&user).Error; err != nil {
		return nil, err
	}
	return user, nil
}
