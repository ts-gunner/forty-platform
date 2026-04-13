package entity

type AuditAccessRecord struct {
	ID          uint64 `gorm:"column:id;type:BIGINT UNSIGNED;autoIncrement;primaryKey" json:"id"`
	BizType     string `gorm:"column:biz_type;type:VARCHAR(50);not null" json:"biz_type"`        // 业务类型
	BizDesc     string `gorm:"column:biz_desc;type:VARCHAR(50);not null;unique" json:"biz_desc"` // 业务描述（唯一）
	Status      string `gorm:"column:status;type:VARCHAR(255)" json:"status"`                    // 审核状态 0-待审核 1-通过 2-驳回
	Remark      string `gorm:"column:remark;type:VARCHAR(1000)" json:"remark"`                   // 审核备注
	ApplyUser   string `gorm:"column:apply_user;type:VARCHAR(255)" json:"apply_user"`            // 申请人名称
	ApplyRemark string `gorm:"column:apply_remark;type:VARCHAR(1000)" json:"apply_remark"`       // 申请人备注
	BaseRecordField
	BaseSchemaField
}
