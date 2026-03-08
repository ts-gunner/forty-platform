package entity

/*
*
客户表定义
*/
type CrmCustomerEntity struct {
	Id          int64  `gorm:"primary_key;column:id;AUTO_INCREMENT"`
	EntityName  string `gorm:"column:entity_name;not null;comment:客户实体表名"`
	EntityCode  string `gorm:"column:entity_code;not null;comment:客户实体唯一标识"`
	Description string `gorm:"column:description;comment:描述"`
	BaseRecordField
	BaseSchemaField
}

func (CrmCustomerEntity) TableName() string { return "crm_customer_entity" }

/*
*
客户实体表有哪些字段
*/
type CrmCustomerFields struct {
	Id          int64  `gorm:"primary_key;column:id;AUTO_INCREMENT"`
	EntityId    int64  `gorm:"column:entity_id;not null;comment:客户实体定义表id"`
	FieldKey    string `gorm:"column:field_key;not null;comment:字段名（英文）"`
	DisplayName string `gorm:"column:display_name;not null;comment:字段名解释（中文）"`
	DataType    int    `gorm:"column:data_type;comment:数据类型，枚举类"`
	IsRequired  bool   `gorm:"column:is_required;comment:是否必填"`
	SortOrder   int    `gorm:"column:sort_order;comment:排序顺序"`
	BaseRecordField
	BaseSchemaField
}

func (CrmCustomerFields) TableName() string { return "crm_customer_fields" }

/*
*
客户实体表具体数据
*/
type CrmCustomerValues struct {
	Id           int64          `gorm:"primary_key;column:id;AUTO_INCREMENT"`
	CustomerName string         `gorm:"column:customer_name;not null;comment:固定字段，客户名称"`
	Values       map[string]any `gorm:"column:values;type:json;null;comment:客户数据"`
	BaseRecordField
	BaseSchemaField
}

func (CrmCustomerValues) TableName() string { return "crm_customer_values" }
