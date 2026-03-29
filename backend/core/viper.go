package core

import (
	"bytes"
	"fmt"
	"strings"

	"github.com/a8m/envsubst"
	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/global"
)

// 初始化读取配置
func InitViperConfig() *viper.Viper {

	v := viper.New()

	renderedContent, err := envsubst.ReadFile(constant.CONFIG_FILEPATH)
	if err != nil {
		panic(fmt.Errorf("环境变量渲染失败: %w", err))
	}
	v.SetConfigType("yaml")
	if err := v.ReadConfig(bytes.NewBuffer(renderedContent)); err != nil {
		panic(fmt.Errorf("解析配置文件失败: %w", err))
	}

	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_", "-", "_"))

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
