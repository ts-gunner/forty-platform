package system

type PermissionListRequest struct {
	PageNum        int    `form:"pageNum" json:"pageNum"`
	PageSize       int    `form:"pageSize" json:"pageSize"`
	PermissionName string `form:"permissionName" json:"permissionName"`
	Type           *int   `form:"type" json:"type"`
	Perms          string `form:"perms" json:"perms"`
}

type PermissionCreateRequest struct {
	PermissionName string `json:"permissionName" binding:"required"`
	Type           int    `json:"type"`
	Perms          string `json:"perms"`
}

type PermissionUpdateRequest struct {
	PermissionId   int64  `json:"permissionId" binding:"required"`
	PermissionName string `json:"permissionName"`
	Type           *int   `json:"type"`
	Perms          string `json:"perms"`
}

type PermissionDeleteRequest struct {
	PermissionId int64 `json:"permissionId" binding:"required"`
}

type PermissionDetailRequest struct {
	PermissionId int64 `form:"permissionId" json:"permissionId" binding:"required"`
}
