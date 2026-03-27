package crm

type CrmCustomerFavoriteVo struct {
	Id           int64  `json:"id,string"`
	EntityId     int64  `json:"entityId,string"`
	EntityName   string `json:"entityName"`
	ValueId      int64  `json:"valueId,string"`
	CustomerName string `json:"customerName"`
	Remark       string `json:"remark"`
	Values       string `json:"values"`
	CreateTime   string `json:"createTime"`
}
