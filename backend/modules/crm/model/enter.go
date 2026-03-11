package model

var CrmModel = new(CrmModelGroup)

type CrmModelGroup struct {
	CrmEntityModel
	CrmEntityFieldModel
}
