package system

type RolePermissionRelVo struct {
	PermissionId   int64  `json:"permissionId,string"`
	PermissionName string `json:"permissionName"`
	Type           int    `json:"type"`
	Perms          string `json:"perms"`
}

type RoleWithPermissionVo struct {
	RoleId   int64  `json:"roleId,string"`
	RoleName string `json:"roleName"`
	RoleKey  string `json:"roleKey"`
}
