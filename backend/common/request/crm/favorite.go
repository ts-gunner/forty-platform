package crm

type AddCustomerFavoriteRequest struct {
	EntityId int64 `json:"entityId,string" binding:"required"`
	ValueId  int64 `json:"valueId,string" binding:"required"`
}

type RemoveCustomerFavoriteRequest struct {
	EntityId int64 `json:"entityId,string" binding:"required"`
	ValueId  int64 `json:"valueId,string" binding:"required"`
}

type GetCustomerFavoriteListRequest struct {
	PageNum  int   `form:"pageNum" json:"pageNum"`
	PageSize int   `form:"pageSize" json:"pageSize"`
	EntityId int64 `form:"entityId,string" json:"entityId,string"`
}

type CheckCustomerFavoriteRequest struct {
	EntityId int64 `form:"entityId,string" json:"entityId,string" binding:"required"`
	ValueId  int64 `form:"valueId,string" json:"valueId,string" binding:"required"`
}
