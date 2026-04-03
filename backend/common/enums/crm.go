package enums

type CrmFieldDataType string

const (
	CrmDataTypeText          CrmFieldDataType = "text"            // 文本
	CrmDataTypeTextArea      CrmFieldDataType = "textarea"        // 多行文本
	CrmDataTypeNumber        CrmFieldDataType = "number"          // 数字
	CrmDataTypeBoolean       CrmFieldDataType = "bool"            // 布尔值
	CrmDataTypePicker        CrmFieldDataType = "picker"          // 选择器
	CrmDataTypePickerOrOther CrmFieldDataType = "picker_or_other" // 选择器或者其他自定义普通文本
	CrmDataTypeDate          CrmFieldDataType = "date"            // 日期
	CrmDataTypeRegion        CrmFieldDataType = "region"          // 行政区划, 示例：["44", "4401", "440101"]
	CrmDataTypeLocation      CrmFieldDataType = "location"        // 定位 + 普通文本， 示例:
)
