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
)

var (
	CASBIN_INIT_MAP = []models.CasbinRule{
		{
			Subject: ROLE_ADMIN,
			Object:  "/ft/audit/review/updateAudit",
			Action:  "POST",
		},
		{
			Subject: ROLE_WECHAT_CRM_ADMIN,
			Object:  "/ft/audit/review/updateAudit",
			Action:  "POST",
		},
		{
			Subject: ROLE_ADMIN,
			Object:  "/ft/audit/review/getAuditList",
			Action:  "GET",
		},
		{
			Subject: ROLE_WECHAT_CRM_ADMIN,
			Object:  "/ft/audit/review/getAuditList",
			Action:  "GET",
		},
		{
			Subject: ROLE_WECHAT_CRM_ADMIN,
			Object:  "/ft/audit/review/getAuditList",
			Action:  "GET",
		},
		{
			Subject: ROLE_WECHAT_CRM,
			Object:  "/ft/crm/value/list",
			Action:  "POST",
		},
		{
			Subject: ROLE_WECHAT_CRM,
			Object:  "/ft/crm/value/listBySelf",
			Action:  "POST",
		},
		{
			Subject: ROLE_WECHAT_CRM,
			Object:  "/ft/crm/value/detail",
			Action:  "GET",
		},
	}
)
