package constant

type AUDIT_BIZ_TYPE string

// 业务类型
const (
	AUDIT_ACCESS_CRM AUDIT_BIZ_TYPE = "access_crm" // 访问crm小程序
)

var AUDIT_BIZ_MAP = map[AUDIT_BIZ_TYPE]string{
	AUDIT_ACCESS_CRM: "访问crm小程序",
}
