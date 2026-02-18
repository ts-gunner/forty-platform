package system

type RolePermissionRelVo struct {
	PermissionId   int64  `json:"permissionId"`
	PermissionName string `json:"permissionName"`
	Type           int    `json:"type"`
	Perms          string `json:"perms"`
}

type RoleWithPermissionVo struct {
	RoleId   int64  `json:"roleId"`
	RoleName string `json:"roleName"`
	RoleKey  string `json:"roleKey"`
}
