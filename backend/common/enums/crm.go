package enums

type CrmFieldDataType string

const (
	CrmDataTypeText     CrmFieldDataType = "text"     // 文本
	CrmDataTypeTextArea CrmFieldDataType = "textarea" // 多行文本
	CrmDataTypeNumber   CrmFieldDataType = "number"   // 数字
	CrmDataTypeBoolean  CrmFieldDataType = "bool"     // 布尔值
	CrmDataTypePicker   CrmFieldDataType = "picker"   // 选择器
	CrmDataTypeDate     CrmFieldDataType = "date"     // 日期
	CrmDataTypeRegion   CrmFieldDataType = "region"   // 行政区划
	CrmDataTypeLocation CrmFieldDataType = "location" // 定位
)
