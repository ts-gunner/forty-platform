package crm

type GetCrmEntityValueListRequest struct {
	PageNum      int            `json:"pageNum"`
	PageSize     int            `json:"pageSize"`
	FilterParams map[string]any `json:"filterParams"`
	EntityKey    string         `json:"entityKey" binding:"required"`
	UserId       int64          `json:"userId,string"`
}

type AdminGetCrmEntityValueListRequest struct {
	PageNum      int            `json:"pageNum"`
	PageSize     int            `json:"pageSize"`
	FilterParams map[string]any `json:"filterParams"`
	EntityId     int64          `json:"entityId,string" binding:"required"`
	UserId       int64          `json:"userId,string"`
	IsDelete     *int8          `json:"isDelete"`
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
