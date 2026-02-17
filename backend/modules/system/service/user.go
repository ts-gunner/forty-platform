package service

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
)

type UserService struct {
}

func (UserService) GetSysUserByAccount(account string) (*entity.SysUser, error) {
	var sysUser entity.SysUser
	if err := global.DB.Where(map[string]any{
		"account":   account,
		"is_delete": 0,
	}).First(&sysUser).Error; err != nil {
		return nil, err
	} else {
		return &sysUser, nil
	}
}
