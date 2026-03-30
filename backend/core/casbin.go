package core

import (
	"fmt"
	"github.com/casbin/casbin/v3"
	"github.com/casbin/casbin/v3/model"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/global"
	"go.uber.org/zap"
)

func InitCasbinEnforcer() *casbin.Enforcer {
	if global.DB == nil {
		db, _ := InitGorm()
		global.DB = db
	}
	adapter, err := gormadapter.NewAdapterByDB(global.DB)
	if err != nil {
		panic("创建casbin适配器失败: " + err.Error())
	}
	// RBAC模型
	m, err := model.NewModelFromString(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
`)
	enforcer, err := casbin.NewEnforcer(m, adapter)
	if err != nil {
		panic("创建casbin校验器失败: " + err.Error())
	}
	initDefaultRules(enforcer)
	if err = enforcer.LoadPolicy(); err != nil {
		panic("加载权限配置失败: " + err.Error())
	}
	return enforcer
}

func initDefaultRules(enforce *casbin.Enforcer) {
	for _, rule := range constant.CASBIN_INIT_MAP {
		ok, err := enforce.AddPolicy(rule.Subject, rule.Object, rule.Action)
		if err != nil {
			global.Logger.Error("添加策略异常", zap.Any("rule", rule), zap.Error(err))
		}
		if ok {
			global.Logger.Info("添加策略成功!", zap.Any("rule", rule))
		} else {
			global.Logger.Info(fmt.Sprintf("策略已存在"), zap.Any("rule", rule))

		}
	}
	_ = enforce.SavePolicy()
}
