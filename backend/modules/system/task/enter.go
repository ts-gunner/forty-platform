package task

import (
	"github.com/robfig/cron/v3"
	"github.com/ts-gunner/forty-platform/common/global"
	"go.uber.org/zap"
)

func InitSystemTask() {
	c := cron.New(cron.WithSeconds())
	global.Logger.Info("初始化system模块的定时任务组....")
	// 每5秒执行一次
	_, err := c.AddFunc("*/5 * * * * *", AddCrmRole)
	if err != nil {
		global.Logger.Error("添加定时任务失败", zap.Error(err))
		return
	}
	c.Start()
}
