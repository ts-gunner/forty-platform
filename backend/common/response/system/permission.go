package system

import "time"

type PermissionVo struct {
	PermissionId   int64     `json:"permissionId"`
	PermissionName string    `json:"permissionName"`
	Type           int       `json:"type"`
	Perms          string    `json:"perms"`
	CreateTime     time.Time `json:"createTime"`
	UpdateTime     time.Time `json:"updateTime"`
}
