package entity

type AuditAccessRecord struct {
	ID          int64  `gorm:"column:id;type:BIGINT UNSIGNED;autoIncrement;primaryKey"`
	BizType     string `gorm:"column:biz_type;type:VARCHAR(50);not null"`   // 业务类型
	BizDesc     string `gorm:"column:biz_desc;type:VARCHAR(50);not null"`   // 业务描述
	BizId       string `gorm:"column:biz_id;type:VARCHAR(255);not null"`    // 业务ID
	AuditCode   string `gorm:"column:audit_code;type:VARCHAR(50);not null"` // 审核代码
	Status      int    `gorm:"column:status;default:0"`                     // 审核状态 0-待审核 1-通过 2-驳回
	Remark      string `gorm:"column:remark;type:VARCHAR(1000)"`            // 审核备注
	ApplyUser   string `gorm:"column:apply_user;type:VARCHAR(255)"`         // 申请人名称
	ApplyRemark string `gorm:"column:apply_remark;type:VARCHAR(1000)"`      // 申请人备注
	BaseRecordField
	BaseSchemaField
}

func (AuditAccessRecord) TableName() string { return "audit_access_record" }
