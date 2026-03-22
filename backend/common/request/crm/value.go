package crm

type GetCrmEntityValueListRequest struct {
	PageNum   int    `form:"pageNum" json:"pageNum"`
	PageSize  int    `form:"pageSize" json:"pageSize"`
	EntityKey string `form:"entityKey" json:"entityKey" binding:"required"`
}

type GetCrmEntityValueDetailRequest struct {
	EntityValueId int64 `form:"entityValueId" json:"entityValueId" binding:"required"`
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

type UpdateCrmEntityValueRequest struct {
	Id           int64  `json:"id,string" binding:"required"`
	CustomerName string `json:"customerName" binding:"required"`
	Remark       string `json:"remark"`
	Values       string `json:"values"`
}

type DeleteCrmEntityValueRequest struct {
	Id int64 `json:"id,string" binding:"required"`
}
