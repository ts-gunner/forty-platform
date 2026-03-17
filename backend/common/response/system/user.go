package system

import "time"

type UserVo struct {
	UserId     int64     `json:"userId,string"`
	Account    string    `json:"account"`
	OpenId     string    `json:"openId"`
	NickName   string    `json:"nickName"`
	Phone      string    `json:"phone"`
	Email      string    `json:"email"`
	AvatarId   string    `json:"avatarId"`
	Status     int       `json:"status"`
	RoleNames  string    `json:"roleNames"` // 角色列表， 逗号相隔
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}
