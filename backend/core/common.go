package core

import (
	"fmt"
	"os"

	"github.com/casbin/casbin/v3"
	"github.com/casbin/casbin/v3/model"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"github.com/sony/sonyflake/v2"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/utils"
	"github.com/ts-gunner/forty-platform/core/internal"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// 初始化日志模块
func InitZapLogger() (logger *zap.Logger) {
	if ok, _ := utils.FolderPathExists(global.Config.Zap.Director); !ok {
		fmt.Printf("创建日志文件夹 --> %s\n", global.Config.Zap.Director)
		_ = os.Mkdir(global.Config.Zap.Director, os.ModePerm)
	}
	level, err := zapcore.ParseLevel(global.Config.Zap.Level)
	if err != nil {
		level = zapcore.InfoLevel
	}
	logger = zap.New(internal.NewZapCore(level))

	if global.Config.Zap.ShowLine {
		logger = logger.WithOptions(zap.AddCaller())
	}
	return logger
}

// 初始化ID生成器
func InitIDCreator() *sonyflake.Sonyflake {
	st := sonyflake.Settings{
		BitsSequence: 1,
		MachineID:    nil,
	}

	sf, err := sonyflake.New(st)
	if err != nil {
		panic("创建id生成器失败: " + err.Error())
	}
	return sf
}

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
	if err = enforcer.LoadPolicy(); err != nil {
		panic("加载权限配置失败: " + err.Error())
	}
	return enforcer
}
