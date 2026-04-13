package audit

type CreateAuditRequest struct {
	BizType     string `json:"bizType" binding:"required"`
	BizDesc     string `json:"bizDesc" binding:"required"`
	ApplyUser   string `json:"applyUser" binding:"required"`
	ApplyRemark string `json:"applyRemark"`
}

type UpdateAuditRequest struct {
	ID     int64  `json:"id,string" binding:"required"`
	Status int    `json:"status" binding:"required"`
	Remark string `json:"remark"`
}

type DeleteAuditRequest struct {
	ID uint64 `json:"id" binding:"required"`
}

type GetAuditListRequest struct {
	BizType  string `form:"bizType"`
	Status   *int   `form:"status"`
	PageNum  int    `form:"pageNum" json:"pageNum"`
	PageSize int    `form:"pageSize" json:"pageSize"`
}

type GetAuditDetailRequest struct {
	ID uint64 `form:"id" binding:"required"`
}
