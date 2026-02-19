package system

type RolePermissionRelListByRoleRequest struct {
	RoleId int64 `form:"roleId,string" json:"roleId" binding:"required"`
}

type RolePermissionRelListByPermissionRequest struct {
	PermissionId int64 `form:"permissionId,string" json:"permissionId" binding:"required"`
}

type RolePermissionRelAssignRequest struct {
	RoleId        int64   `json:"roleId,string" binding:"required"`
	PermissionIds []int64 `json:"permissionIds" binding:"required"`
}

type RolePermissionRelRemoveRequest struct {
	RoleId       int64 `json:"roleId,string" binding:"required"`
	PermissionId int64 `json:"permissionId,string" binding:"required"`
}
