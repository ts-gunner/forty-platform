package core

import "C"
import (
	"fmt"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/utils"
	"github.com/ts-gunner/forty-platform/core/internal"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
)

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
