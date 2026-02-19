package system

type RoleListRequest struct {
	PageNum  int    `form:"pageNum" json:"pageNum"`
	PageSize int    `form:"pageSize" json:"pageSize"`
	RoleName string `form:"roleName" json:"roleName"`
	RoleKey  string `form:"roleKey" json:"roleKey"`
}

type RoleCreateRequest struct {
	RoleName string `json:"roleName" binding:"required"`
	RoleKey  string `json:"roleKey" binding:"required"`
}

type RoleUpdateRequest struct {
	RoleId   int64  `json:"roleId,string" binding:"required"`
	RoleName string `json:"roleName"`
	RoleKey  string `json:"roleKey"`
}

type RoleDeleteRequest struct {
	RoleId int64 `json:"roleId,string" binding:"required"`
}

type RoleDetailRequest struct {
	RoleId int64 `form:"roleId,string" json:"roleId" binding:"required"`
}
