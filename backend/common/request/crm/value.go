package crm

type GetCrmEntityValueListRequest struct {
	PageNum  int   `form:"pageNum" json:"pageNum"`
	PageSize int   `form:"pageSize" json:"pageSize"`
	EntityId int64 `form:"entityId" json:"entityId" binding:"required"`
}
