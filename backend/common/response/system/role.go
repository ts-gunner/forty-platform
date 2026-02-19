package system

import "time"

type RoleVo struct {
	RoleId     int64     `json:"roleId,string"`
	RoleName   string    `json:"roleName"`
	RoleKey    string    `json:"roleKey"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}
