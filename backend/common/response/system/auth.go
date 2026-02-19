package system

import "github.com/golang-jwt/jwt/v5"

/*
*
运营端的jwt claim
存入到redis中
*/
type AdminUserClaim struct {
	UserId   int64  `json:"user_id,string"`
	Account  string `json:"account"`
	NickName string `json:"nickname"`
	Avatar   string `json:"avatar"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	jwt.RegisteredClaims
}
