package crm

type GetCrmEntityValueListRequest struct {
	PageNum  int   `form:"pageNum" json:"pageNum"`
	PageSize int   `form:"pageSize" json:"pageSize"`
	EntityId int64 `form:"entityId" json:"entityId" binding:"required"`
}

type InsertCrmEntityValueRequest struct {
	EntityId int64                `json:"entityId,string" binding:"required"`
	Data     []CrmEntityValueData `json:"data" binding:"required"`
}

type CrmEntityValueData struct {
	CustomerName string `json:"customerName" binding:"required"`
	Remark       string `json:"remark"`
	Values       string `json:"values"`
}
