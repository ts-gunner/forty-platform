package crm

type GetEntityListRequest struct {
	PageNum    int    `form:"pageNum" json:"pageNum"`
	PageSize   int    `form:"pageSize" json:"pageSize"`
	EntityName string `form:"entityName" json:"entityName"` // 实体名称
}
