package enums

type CrmFieldDataType int

const (
	CrmDataTypeText    CrmFieldDataType = iota + 1 // 文本
	CrmDataTypeNumber                              // 数字
	CrmDataTypeBoolean                             // 布尔值
	CrmDataTypeDate                                // 日期
)
