package crm

import (
	"time"

	"github.com/ts-gunner/forty-platform/common/response"
)

type CrmEntityValueVo struct {
	Id           int64     `json:"id,string"`
	CustomerName string    `json:"customer_name"`
	Remark       string    `json:"remark"`
	Values       string    `json:"values"`
	CreateTime   time.Time `json:"create_time"`
}

type CrmEntityValueObjectVo struct {
	EntityId    int64                                 `json:"entityId,string"`
	FieldList   []CrmEntityFieldVo                    `json:"field_list"`
	EntityValue response.PageResult[CrmEntityValueVo] `json:"entity_value"`
}
