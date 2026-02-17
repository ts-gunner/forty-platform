package internal

import (
	"github.com/ts-gunner/forty-platform/common/global"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
	"time"
)

type CustomZapCore struct {
	level zapcore.Level
	zapcore.Core
}

func NewZapCore(level zapcore.Level) *CustomZapCore {
	entity := &CustomZapCore{level: level}
	syncer := entity.WriteSyncer()
	// 过滤掉小于level等级的日志
	levelEnabler := zap.LevelEnablerFunc(func(l zapcore.Level) bool {
		return l >= level
	})
	entity.Core = zapcore.NewCore(global.Config.Zap.Encoder(), syncer, levelEnabler)
	return entity
}

func (c *CustomZapCore) WriteSyncer() zapcore.WriteSyncer {
	cutter := NewCutter(
		global.Config.Zap.Director,
		global.Config.Zap.Level,
		CutterWithLayout(time.DateOnly),
		CutterWithFormat(),
	)
	if global.Config.Zap.LogInConsole {
		return zapcore.AddSync(zapcore.NewMultiWriteSyncer(os.Stdout, cutter))
	}
	return zapcore.AddSync(cutter)
}
