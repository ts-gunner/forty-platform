package response

// 运营端的用户数据
type AdminUserVo struct {
	Token    string `json:"token"`    // 登录凭证
	Account  string `json:"account"`  // 账号
	NickName string `json:"nickname"` // 用户昵称
	Avatar   string `json:"avatar"`   // 头像地址
	Phone    string `json:"phone"`    // 手机号码
	Email    string `json:"email"`    // 邮箱
}
