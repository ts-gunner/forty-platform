package system

type UserListRequest struct {
	PageNum  int    `form:"pageNum" json:"pageNum"`
	PageSize int    `form:"pageSize" json:"pageSize"`
	Account  string `form:"account" json:"account"`
	NickName string `form:"nickName" json:"nickName"`
	Phone    string `form:"phone" json:"phone"`
	Status   *int   `form:"status" json:"status"`
}

type UserCreateRequest struct {
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`
	NickName string `json:"nickName" binding:"required"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	AvatarId string `json:"avatarId"`
	Status   int    `json:"status"`
}

type UserUpdateRequest struct {
	UserId   int64  `json:"userId" binding:"required"`
	NickName string `json:"nickName"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	AvatarId string `json:"avatarId"`
	Status   *int   `json:"status"`
}

type UserResetPwdRequest struct {
	UserId      int64  `json:"userId" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required"`
}

type UserDeleteRequest struct {
	UserId int64 `json:"userId" binding:"required"`
}

type UserDetailRequest struct {
	UserId int64 `form:"userId" json:"userId" binding:"required"`
}
