package core

import (
	"fmt"
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
)

// 初始化读取配置
func InitViperConfig() *viper.Viper {

	v := viper.New()
	v.SetConfigFile(constant.CONFIG_FILEPATH)
	err := v.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("读取配置文件失败: %w \n", err))
	}
	v.WatchConfig()
	v.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("配置文件发生改动:", e.Name)
		if err = v.Unmarshal(&global.Config); err != nil {
			fmt.Printf("动态更新失败: %s\n", err)
		}
		// 重新设置logger
		//Logger = InitZapLogger()
	})
	if err = v.Unmarshal(&global.Config); err != nil {
		panic(fmt.Errorf("解析配置文件失败: %w", err))
	}
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
