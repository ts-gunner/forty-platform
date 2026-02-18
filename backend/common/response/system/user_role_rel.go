package system

type UserRoleRelVo struct {
	RoleId   int64  `json:"roleId"`
	RoleName string `json:"roleName"`
	RoleKey  string `json:"roleKey"`
}

type UserWithRoleVo struct {
	UserId   int64  `json:"userId"`
	Account  string `json:"account"`
	NickName string `json:"nickName"`
}
