package entity

import "time"

type BaseRecordField struct {
	CreatorId int64  `json:"creatorId" gorm:"column:creator_id;comment:创建者id"`
	UpdaterId *int64 `json:"updaterId" gorm:"column:updater_id;comment:更新者id"`
	DeleterId *int64 `json:"deleterId" gorm:"column:deleter_id;comment:删除者id"`
}
type BaseSchemaField struct {
	IsDelete   int8       `json:"isDelete" gorm:"default:0;column:is_delete"`
	CreateTime time.Time  `json:"createTime" gorm:"column:create_time;autoCreateTime:milli"`
	UpdateTime time.Time  `json:"updateTime" gorm:"column:update_time;autoUpdateTime:milli"`
	DeleteTime *time.Time `json:"deleteTime" gorm:"column:delete_time;null;"`
}
