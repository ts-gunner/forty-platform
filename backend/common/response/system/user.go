package system

import "time"

type UserVo struct {
	UserId     int64     `json:"userId"`
	Account    string    `json:"account"`
	NickName   string    `json:"nickName"`
	Phone      string    `json:"phone"`
	Email      string    `json:"email"`
	AvatarId   string    `json:"avatarId"`
	Status     int       `json:"status"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}
