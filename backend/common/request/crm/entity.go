package crm

type GetEntityListRequest struct {
	PageNum    int    `form:"pageNum" json:"pageNum"`
	PageSize   int    `form:"pageSize" json:"pageSize"`
	EntityName string `form:"entityName" json:"entityName"`
	EntityCode string `form:"entityCode" json:"entityCode"`
}
type GetEntityByKeyRequest struct {
	EntityKey string `form:"entityKey" json:"entityKey"`
}

type EntityCreateRequest struct {
	EntityName  string `json:"entityName" binding:"required"`
	EntityCode  string `json:"entityCode" binding:"required"`
	Description string `json:"description"`
}

type EntityUpdateRequest struct {
	EntityId    int64  `json:"entityId,string" binding:"required"`
	EntityName  string `json:"entityName"`
	EntityCode  string `json:"entityCode"`
	Description string `json:"description"`
}

type EntityDeleteRequest struct {
	EntityId int64 `json:"entityId,string" binding:"required"`
}

type EntityDetailRequest struct {
	EntityId int64 `form:"entityId,string" json:"entityId" binding:"required"`
}
