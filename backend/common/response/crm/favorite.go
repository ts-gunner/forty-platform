package crm

type CrmCustomerFavoriteVo struct {
	Id           int64  `json:"id"`
	EntityId     int64  `json:"entityId"`
	EntityName   string `json:"entityName"`
	ValueId      int64  `json:"valueId"`
	CustomerName string `json:"customerName"`
	Remark       string `json:"remark"`
	Values       string `json:"values"`
	CreateTime   string `json:"createTime"`
}
