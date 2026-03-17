package system

type PwdLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type WechatCodeLoginRequest struct {
	Code string `json:"code"`
}
