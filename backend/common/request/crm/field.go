package crm

type GetCrmEntityFieldRequest struct {
	EntityId int64 `form:"entityId,string" binding:"required"`
}
type GetCrmEntityFieldByKeyRequest struct {
	EntityKey string `form:"entityKey" binding:"required"`
}
type UpsertCrmEntityFieldRequest struct {
	EntityId int64            `json:"entityId,string" binding:"required"`
	Fields   []CrmEntityField `json:"fields" binding:"required"`
}
type CrmEntityField struct {
	Id         *int64 `json:"id,string"`
	FieldName  string `json:"fieldName" binding:"required"`
	FieldKey   string `json:"fieldKey" binding:"required"`
	DataType   string `json:"dataType" binding:"required"`
	Options    string `json:"options"`
	IsRequired bool   `json:"isRequired" binding:"required"`
	SortOrder  int    `json:"sortOrder" binding:"required"`
}

type RestoreCrmEntityFieldRequest struct {
	FieldId int64 `json:"fieldId,string" binding:"required"`
}
