package crm

type CrmEntityFieldVo struct {
	Id         int64  `json:"id,string"`
	EntityId   int64  `json:"entityId,string"`
	FieldKey   string `json:"fieldKey"`
	FieldName  string `json:"fieldName"`
	DataType   string `json:"dataType"`
	Options    string `json:"options"`
	IsRequired bool   `json:"isRequired"`
	SortOrder  int    `json:"sortOrder"`
}
