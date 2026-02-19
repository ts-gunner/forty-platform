package system

type UserRoleRelListByUserRequest struct {
	UserId int64 `form:"userId,string" json:"userId" binding:"required"`
}

type UserRoleRelListByRoleRequest struct {
	RoleId int64 `form:"roleId,string" json:"roleId" binding:"required"`
}

type UserRoleRelAssignRequest struct {
	UserId  int64   `json:"userId,string" binding:"required"`
	RoleIds []int64 `json:"roleIds" binding:"required"`
}

type UserRoleRelRemoveRequest struct {
	UserId int64 `json:"userId,string" binding:"required"`
	RoleId int64 `json:"roleId,string" binding:"required"`
}
