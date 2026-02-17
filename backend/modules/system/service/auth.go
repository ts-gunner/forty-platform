package service

import (
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/response"
)

type AuthService struct {
}

func (AuthService) AdminLogin(user *entity.SysUser) (*response.AdminUserVo, error) {
	userVo := response.AdminUserVo{}
	if err := copier.Copy(&userVo, user); err != nil {
		return nil, err
	}
	return &userVo, nil
}
