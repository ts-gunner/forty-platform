package main

import (
	"fmt"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/core"
)

// @title 四零专属管理后台
// @version 1.0
// @description 使用go语言搭建的管理后端
func main() {
	initializeSystem()
	core.RunServer()
}

func initializeSystem() {
	global.Viper = core.InitViperConfig()
	global.Logger = core.InitZapLogger()
	if db, err := core.InitGorm(); err != nil {
		panic(fmt.Sprintf("数据库初始化异常: %v", err))
	} else {
		global.DB = db
	}
}
