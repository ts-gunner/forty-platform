package audit

import "time"

type AuditAccessRecordVo struct {
	ID          int64     `json:"id,string"`
	BizType     string    `json:"bizType"`     // 业务类型
	BizDesc     string    `json:"bizDesc"`     // 业务描述
	AuditCode   string    `json:"auditCode"`   // 审核代码
	Status      int       `json:"status"`      // 审核状态 0-待审核 1-通过 2-驳回
	Remark      string    `json:"remark"`      // 审核备注
	ApplyUser   string    `json:"applyUser"`   // 申请人名称
	ApplyRemark string    `json:"applyRemark"` // 申请人备注
	CreateTime  time.Time `json:"createTime"`
}
