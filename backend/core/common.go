package core

import (
	"bytes"
	"fmt"
	"github.com/casbin/casbin/v3"
	"github.com/casbin/casbin/v3/model"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"github.com/drone/envsubst"
	"github.com/fsnotify/fsnotify"
	"github.com/sony/sonyflake/v2"
	"github.com/spf13/viper"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/utils"
	"github.com/ts-gunner/forty-platform/core/internal"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
	"strings"
)

// 初始化读取配置
func InitViperConfig() *viper.Viper {

	v := viper.New()

	content, err := os.ReadFile(constant.CONFIG_FILEPATH)
	if err != nil {
		panic(fmt.Errorf("无法读取配置文件: %w", err))
	}
	renderedContent, err := envsubst.EvalEnv(string(content))
	if err != nil {
		panic(fmt.Errorf("环境变量渲染失败: %w", err))
	}
	v.SetConfigType("yaml")
	if err := v.ReadConfig(bytes.NewBufferString(renderedContent)); err != nil {
		panic(fmt.Errorf("解析配置文件失败: %w", err))
	}

	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_", "-", "_"))
	v.AutomaticEnv()
	v.AllowEmptyEnv(true)
	if err = v.Unmarshal(&global.Config); err != nil {
		panic(fmt.Errorf("解析配置文件失败: %w", err))
	}

	// 监听配置
	v.WatchConfig()
	v.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("配置文件发生改动:", e.Name)
		if err = v.Unmarshal(&global.Config); err != nil {
			fmt.Printf("动态更新失败: %s\n", err)
		}
		// 重新设置logger
		//Logger = InitZapLogger()
	})
	return v
}

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
	adapter, err := gormadapter.NewAdapterByDBWithCustomTable(global.DB, &gormadapter.CasbinRule{}, "casbin_rbac_rule")
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
