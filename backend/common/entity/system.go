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
	AvatarId string `json:"avatarId" gorm:"column:avatar_id;comment:头像资源id"`
	NickName string `json:"nickName" gorm:"column:nickname;not null;comment:昵称"`
	Email    string `json:"email" gorm:"column:email;comment:邮箱"`
	Phone    string `json:"phone" gorm:"column:phone;comment:手机号码"`
	Status   int    `json:"status" gorm:"column:status;default:1;comment:账号状态，0:停用，1正常"`
	BaseRecordField
	BaseSchemaField
}

func (user *SysUser) TableName() string { return "sys_user" }
