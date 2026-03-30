package constant

import "github.com/ts-gunner/forty-platform/common/models"

const (
	PROJECT_BANNER = `
 .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |  _________   | || |     ____     | || |  _______     | || |  _________   | || |  ____  ____  | |
| | |_   ___  |  | || |   .'    '.   | || | |_   __ \    | || | |  _   _  |  | || | |_  _||_  _| | |
| |   | |_  \_|  | || |  /  .--.  \  | || |   | |__) |   | || | |_/ | | \_|  | || |   \ \  / /   | |
| |   |  _|      | || |  | |    | |  | || |   |  __ /    | || |     | |      | || |    \ \/ /    | |
| |  _| |_       | || |  \  '--'  /  | || |  _| |  \ \_  | || |    _| |_     | || |    _|  |_    | |
| | |_____|      | || |   '.____.'   | || | |____| |___| | || |   |_____|    | || |   |______|   | |
| |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
'----------------'  '----------------'  '----------------'  '----------------'  '----------------'


欢迎使用forty-platform
项目地址: http://127.0.0.1:%s
项目接口文档地址: http://127.0.0.1:%s%s/doc.html
`
	CONFIG_FILEPATH = "config.yaml"
	SALT            = "forty-platform"
	INIT_PASSWORD   = "ht1234!"
)

const (
	USER_KEY = "claims"
)

// crm默认字段
const (
	CRM_CUSTOMER_NAME   = "customer_name"
	CRM_CUSTOMER_REMARK = "remark"
)

// 初始角色
const (
	ROLE_ADMIN            = "admin"            // 运营端角色
	ROLE_WECHAT_CRM       = "wechat_crm_user"  // 微信CRM用户角色
	ROLE_WECHAT_CRM_ADMIN = "wechat_crm_admin" // 微信CRM管理员角色

)

var (
	CASBIN_INIT_MAP = []models.CasbinRule{
		models.CasbinRule{
			Subject: ROLE_WECHAT_CRM_ADMIN,
			Object:  "/ft/crm/value/list",
			Action:  "POST",
		},
	}
)
