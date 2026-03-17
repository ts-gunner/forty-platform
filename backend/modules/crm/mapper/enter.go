package mapper

var CrmModel = new(CrmModelGroup)

type CrmModelGroup struct {
	CrmEntityMapper
	CrmEntityFieldMapper
}
