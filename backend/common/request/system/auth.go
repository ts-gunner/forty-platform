package system

type PwdLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type WechatCodeLoginRequest struct {
	Code string `json:"code"`
}

type ApprovalWechatAccessRequest struct {
	LoginCode   string `json:"loginCode" binding:"required"` // 微信登录的code
	AuditCode   string `json:"auditCode" binding:"required"` // 提交审核的随机码
	AuditName   string `json:"auditName" binding:"required"` // 申请人名称
	AuditRemark string `json:"auditRemark"`                  // 申请人填写的备注
}
