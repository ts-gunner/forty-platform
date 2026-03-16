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
	CreateTime   time.Time `json:"createTime"`
}

type CrmEntityValueObjectVo struct {
	EntityValue response.PageResult[CrmEntityValueVo] `json:"entityValue"`
}
