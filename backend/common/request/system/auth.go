package system

type PwdLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
