package crm

import "time"

type CrmEntityVo struct {
	EntityId    int64     `json:"entityId,string"`
	EntityName  string    `json:"entityName"`
	EntityCode  string    `json:"entityCode"`
	Description string    `json:"description"`
	CreateTime  time.Time `json:"createTime"`
	UpdateTime  time.Time `json:"updateTime"`
}
