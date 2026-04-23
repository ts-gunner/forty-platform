package analysis

// 基础指标
type BasicIndicator struct {
	BizCount      int64 `json:"businessCount"` // 业务员总数
	CustomerCount int64 `json:"customerCount"` // 客户总数
}

type CustomerIndicator struct {
	UserId        string `json:"userId"`
	UserName      string `json:"userName"`
	CustomerCount int64  `json:"customerCount"`
}

// 客户总数趋势图
type CustomerTrendChart struct {
	StatDate   string `json:"statDate"`
	TotalCount int64  `json:"totalCount"`
}
