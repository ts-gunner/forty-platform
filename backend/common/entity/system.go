package entity

/*
*
系统模块相关的表
*/
type SysUser struct {
	UserId   int64  `json:"userId" gorm:"primaryKey; column:user_id;type:bigint;comment:用户id"`
	Account  string `json:"account" gorm:"column:account;not null;comment:用户账号"`
	Password string `json:"pwd" gorm:"column:pwd;not null;comment:密码"`
	OpenId   string `json:"openid" gorm:"column:openid;comment:微信小程序唯一标识id"`
	UnionId  string `json:"unionId" gorm:"column:unionId;comment:微信开放平台id"`
	AvatarId int64  `json:"avatarId" gorm:"column:avatar_id;type:bigint;comment:头像资源id"`
	NickName string `json:"nickName" gorm:"column:nickname;not null;comment:昵称"`
	Email    string `json:"email" gorm:"column:email;comment:邮箱"`
	Phone    string `json:"phone" gorm:"column:phone;comment:手机号码"`
	Status   int    `json:"status" gorm:"column:status;default:1;comment:账号状态，0:停用，1正常"`
	BaseRecordField
	BaseSchemaField
}

func (SysUser) TableName() string { return "sys_user" }

type SysRole struct {
	RoleId   int64  `json:"roleId" gorm:"primaryKey;column:role_id;type:bigint;comment:角色ID"`
	RoleName string `json:"roleName" gorm:"column:role_name;not null;comment:角色名称"`
	RoleKey  string `json:"roleKey" gorm:"column:role_key;not null;comment:角色标识"`
	BaseRecordField
	BaseSchemaField
}

func (SysRole) TableName() string { return "sys_role" }

type SysPermission struct {
	PermissionId   int64  `json:"permissionId" gorm:"primaryKey;column:permission_id;type:bigint;comment:权限ID"`
	PermissionName string `json:"permissionName" gorm:"column:permission_name;not null;comment:权限名称"`
	Type           int    `json:"type" gorm:"column:type;default:0;comment:类型：0=菜单(C)，1=按钮(F)"`
	Perms          string `json:"perms" gorm:"column:perms;comment:权限标识"`
	BaseRecordField
	BaseSchemaField
}

func (SysPermission) TableName() string { return "sys_permission" }

type SysUserRoleRel struct {
	Id     int64 `json:"id" gorm:"primaryKey;column:id;type:bigint;autoIncrement;comment:主键ID"`
	RoleId int64 `json:"roleId" gorm:"column:role_id;not null;comment:角色ID"`
	UserId int64 `json:"userId" gorm:"column:user_id;not null;comment:用户ID"`
}

func (SysUserRoleRel) TableName() string { return "sys_user_role_rel" }

type SysRolePermissionRel struct {
	Id           int64 `json:"id" gorm:"primaryKey;column:id;type:bigint;autoIncrement;comment:主键ID"`
	RoleId       int64 `json:"roleId" gorm:"column:role_id;not null;comment:角色ID"`
	PermissionId int64 `json:"permissionId" gorm:"column:permission_id;not null;comment:权限ID"`
}

func (SysRolePermissionRel) TableName() string { return "sys_role_permission_rel" }

type SysResource struct {
	ResourceId   int64  `json:"resourceId" gorm:"primaryKey;column:resource_id;type:bigint unsigned;comment:资源ID"`
	ResourceType int    `json:"resourceType" gorm:"column:resource_type;type:int;not null;comment:资源类型，1-用户头像, 2-CRM"`
	UserId       int64  `json:"userId" gorm:"column:user_id;type:bigint unsigned;comment:所属用户ID"`
	StorageType  string `json:"storageType" gorm:"column:storage_type;type:varchar(20);comment:存储类型: superbed | local | aliyun | minio | tencent"`
	RelPath      string `json:"relPath" gorm:"column:rel_path;type:varchar(2000);comment:存储相对路径"`
	PreviewUrl   string `json:"PreviewUrl" gorm:"column:preview_url;type:varchar(2000);comment:预览地址"`
	ResourceName string `json:"resourceName" gorm:"column:resource_name;type:varchar(255);comment:资源名称"`
	MimeType     string `json:"mimeType" gorm:"column:mime_type;type:varchar(100);comment:MIME类型"`
	Suffix       string `json:"suffix" gorm:"column:suffix;type:varchar(20);not null;comment:资源后缀名"`
	Size         int64  `json:"size" gorm:"column:size;type:bigint;not null;default:0;comment:资源大小"`
	BaseRecordField
	BaseSchemaField
}

func (SysResource) TableName() string { return "sys_resource" }
