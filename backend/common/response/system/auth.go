package system

import "github.com/golang-jwt/jwt/v5"

type LoginUserClaim struct {
	UserId   int64  `json:"userId,string"`
	OpenId   string `json:"openId"`
	Account  string `json:"account"`
	NickName string `json:"nickName"`
	Avatar   string `json:"avatar"`
	Phone    string `json:"phone"`
	RoleIds  string `json:"roleIds"`
	jwt.RegisteredClaims
}

type LoginUserVo struct {
	UserId   int64  `json:"userId,string"`
	Account  string `json:"account"`
	NickName string `json:"nickName"`
	Avatar   string `json:"avatar"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
}
