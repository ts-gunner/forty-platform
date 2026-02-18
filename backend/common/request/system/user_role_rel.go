package system

type UserRoleRelListByUserRequest struct {
	UserId int64 `form:"userId" json:"userId" binding:"required"`
}

type UserRoleRelListByRoleRequest struct {
	RoleId int64 `form:"roleId" json:"roleId" binding:"required"`
}

type UserRoleRelAssignRequest struct {
	UserId  int64   `json:"userId" binding:"required"`
	RoleIds []int64 `json:"roleIds" binding:"required"`
}

type UserRoleRelRemoveRequest struct {
	UserId int64 `json:"userId" binding:"required"`
	RoleId int64 `json:"roleId" binding:"required"`
}
