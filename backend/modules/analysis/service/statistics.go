package service

import (
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/global"
	response "github.com/ts-gunner/forty-platform/common/response/analysis"
)

type StatisticsService struct{}

func (StatisticsService) GetBasicCount() (response.BasicIndicator, error) {
	indicator := response.BasicIndicator{}
	if err := global.DB.Raw(`
SELECT
    COUNT(DISTINCT u.user_id) AS user_count
FROM
    sys_user u
INNER JOIN sys_user_role_rel urr ON u.user_id = urr.user_id
INNER JOIN sys_role r ON urr.role_id = r.role_id
WHERE
    r.role_key = ?
    AND u.is_delete = 0 
    AND r.is_delete = 0; 
`, constant.ROLE_WECHAT_CRM).Scan(&indicator.BizCount).Error; err != nil {
		return indicator, err
	}
	if err := global.DB.Raw(`
SELECT COUNT(*) FROM crm_customer_values WHERE is_delete=0;
`).Scan(&indicator.CustomerCount).Error; err != nil {
		return indicator, err
	}
	return indicator, nil
}

func (StatisticsService) GetCustomerCountByUser() ([]response.CustomerIndicator, error) {
	indicators := []response.CustomerIndicator{}
	if err := global.DB.Raw(`
SELECT 
ccv.user_id as user_id, 
su.nickname as user_name,
 COUNT(ccv.id) as customer_count 
 FROM crm_customer_values ccv
LEFT JOIN sys_user su ON su.user_id = ccv.user_id
WHERE ccv.is_delete = 0
GROUP BY ccv.user_id;
`).Scan(&indicators).Error; err != nil {
		return indicators, err
	}
	return indicators, nil
}

func (StatisticsService) GetCustomerTrendChart() ([]response.CustomerTrendChart, error) {
	indicators := []response.CustomerTrendChart{}
	if err := global.DB.Raw(`
SELECT
    day_date AS stat_date,
    @total := @total + day_count AS total_count
FROM (
    -- 第一步：先算出每天新增了多少条
    SELECT
        DATE(create_time) AS day_date,
        COUNT(*) AS day_count
    FROM crm_customer_values
    WHERE is_delete = 0
    GROUP BY DATE(create_time)
    ORDER BY day_date
) AS t1
CROSS JOIN (SELECT @total := 0) AS t2  -- 变量初始化，累加总数
ORDER BY day_date;
`).Scan(&indicators).Error; err != nil {
		return indicators, err
	}
	return indicators, nil
}
