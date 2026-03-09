package crm

type GetCrmEntityFieldRequest struct {
	EntityId int64 `json:"entityId,string" binding:"required"`
}
