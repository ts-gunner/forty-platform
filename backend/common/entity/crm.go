package entity

import "gorm.io/datatypes"

type CrmCustomerEntity struct {
	Id          int64  `gorm:"primary_key;column:id;AUTO_INCREMENT"`
	EntityName  string `gorm:"column:entity_name;not null;comment:客户实体表名"`
	EntityCode  string `gorm:"column:entity_code;not null;comment:客户实体唯一标识"`
	Description string `gorm:"column:description;comment:描述"`
	BaseRecordField
	BaseSchemaField
}

func (CrmCustomerEntity) TableName() string { return "crm_customer_entity" }

type CrmCustomerFields struct {
	Id         int64           `gorm:"primary_key;column:id"`
	EntityId   int64           `gorm:"column:entity_id;not null;comment:客户实体定义表id"`
	FieldKey   string          `gorm:"column:field_key;not null;comment:字段名（英文）"`
	FieldName  string          `gorm:"column:field_name;not null;comment:字段名解释（中文）"`
	DataType   string          `gorm:"column:data_type;comment:数据类型，枚举类"`
	Options    *datatypes.JSON `gorm:"column:options;comment:当数据类型为选择器时的选项值"`
	IsRequired bool            `gorm:"column:is_required;comment:是否必填"`
	SortOrder  int             `gorm:"column:sort_order;comment:排序顺序"`
	BaseRecordField
	BaseSchemaField
}

func (CrmCustomerFields) TableName() string { return "crm_customer_fields" }

type CrmCustomerValues struct {
	Id           int64          `gorm:"primary_key;column:id;AUTO_INCREMENT"`
	EntityId     int64          `gorm:"column:entity_id;not null;comment:客户实体定义表id"`
	CustomerName string         `gorm:"column:customer_name;not null;comment:固定字段，客户名称"`
	Remark       string         `gorm:"column:remark;comment:备注"`
	Values       datatypes.JSON `gorm:"column:values;type:json;null;comment:客户数据"`
	UserId       int64          `gorm:"column:user_id;not null;comment:所属用户id"`
	BaseRecordField
	BaseSchemaField
}

func (CrmCustomerValues) TableName() string { return "crm_customer_values" }

type CrmCustomerFavorite struct {
	Id       int64 `gorm:"primary_key;column:id;AUTO_INCREMENT"`
	EntityId int64 `gorm:"column:entity_id;not null;comment:客户实体定义表id"`
	ValueId  int64 `gorm:"column:value_id;not null; comment:数据id"`
	UserId   int64 `gorm:"column:user_id;not null;comment:用户id"`
}

func (CrmCustomerFavorite) TableName() string { return "crm_customer_favorite" }
