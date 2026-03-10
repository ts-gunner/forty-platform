package crm

type GetCrmEntityFieldRequest struct {
	EntityId int64 `json:"entityId,string" binding:"required"`
}

type AddCrmEntityFieldRequest struct {
	EntityId int64            `json:"entityId,string" binding:"required"`
	Fields   []CrmEntityField `json:"fields" binding:"required"`
}
type CrmEntityField struct {
	FieldName  string `json:"fieldName,string" binding:"required"`
	FieldKey   string `json:"fieldKey,string" binding:"required"`
	DataType   int    `json:"dataType" binding:"required"`
	Options    string `json:"options"`
	IsRequired bool   `json:"isRequired" binding:"required"`
	SortOrder  int    `json:"sortOrder" binding:"required"`
}
type UpdateCrmEntityFieldRequest struct {
	FieldId    int64  `json:"fieldId,string" binding:"required"`
	FieldName  string `json:"fieldName"`
	FieldKey   string `json:"fieldKey"`
	DataType   *int   `json:"dataType"`
	IsRequired *bool  `json:"isRequired"`
	SortOrder  *int   `json:"sortOrder"`
}

type DeleteCrmEntityFieldRequest struct {
	FieldId int64 `json:"fieldId,string" binding:"required"`
}
