package core

import (
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
	"github.com/ts-gunner/forty-platform/common/constant"
)

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
		if err = v.Unmarshal(&Config); err != nil {
			fmt.Printf("动态更新失败: %s\n", err)
		}
		// 重新设置logger
		//Logger = InitZapLogger()
	})
	if err = v.Unmarshal(&Config); err != nil {
		panic(fmt.Errorf("解析配置文件失败: %w", err))
	}
	return v
}
