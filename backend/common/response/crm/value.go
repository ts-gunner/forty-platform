package crm

import (
	"time"

	"github.com/ts-gunner/forty-platform/common/response"
)

type CrmEntityValueVo struct {
	Id           int64     `json:"id,string"`
	EntityId     int64     `json:"entityId,string"`
	CustomerName string    `json:"customerName"`
	Remark       string    `json:"remark"`
	Values       string    `json:"values"`
	UserId       int64     `json:"userId,string"`
	UserName     string    `json:"userName"`
	CreateTime   time.Time `json:"createTime"`
	IsDelete     int8      `json:"isDelete"`
}

type CrmEntityValueObjectVo struct {
	EntityValue response.PageResult[CrmEntityValueVo] `json:"entityValue"`
}
