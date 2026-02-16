package config

import (
	"time"

	"go.uber.org/zap/zapcore"
)

type Zap struct {
	Level  string `mapstructure:"level" json:"level" yaml:"level"`    // 日志级别
	Prefix string `mapstructure:"prefix" json:"prefix" yaml:"prefix"` // 日志前缀
	// 日志输出方式，可选值：console | json， json常用于通过第三方软件分析日志，console输出日志更直观
	Format       string `mapstructure:"format" json:"format" yaml:"format"`
	Director     string `mapstructure:"director" json:"director" yaml:"director"`                   // 日志文件夹
	EncodeLevel  string `mapstructure:"encode-level" json:"encode-level" yaml:"encode-level"`       // 编码级
	ShowLine     bool   `mapstructure:"show-line" json:"show-line" yaml:"show-line"`                // 日志显示调用者信息
	LogInConsole bool   `mapstructure:"log-in-console" json:"log-in-console" yaml:"log-in-console"` // 输出控制台
}

func (z Zap) Levels() []zapcore.Level {
	// zap的日志总共7种，等级从-1往上递增 Debug, Info, Warn, Error, DPanic, Panic, Fatal
	levels := make([]zapcore.Level, 0, 7)
	level, err := zapcore.ParseLevel(z.Level)
	if err != nil {
		level = zapcore.InfoLevel
	}
	// 收集大于[z.level]等级的日志
	for ; level <= zapcore.FatalLevel; level++ {
		levels = append(levels, level)
	}
	return levels
}

func (z Zap) Encoder() zapcore.Encoder {
	config := zapcore.EncoderConfig{
		TimeKey:       "time",
		NameKey:       "name",
		LevelKey:      "level",
		CallerKey:     "caller",
		MessageKey:    "msg",
		StacktraceKey: "stacktrace",
		LineEnding:    zapcore.DefaultLineEnding,
		EncodeTime: func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
			enc.AppendString(z.Prefix + t.Format(time.DateTime))
		},
		EncodeLevel:    z.LevelEncoder(),
		EncodeCaller:   zapcore.FullCallerEncoder, // 输出完整调用者信息位置
		EncodeDuration: zapcore.SecondsDurationEncoder,
	}
	if z.Format == "json" {
		return zapcore.NewJSONEncoder(config)
	}
	return zapcore.NewConsoleEncoder(config)
}

func (z Zap) LevelEncoder() zapcore.LevelEncoder {
	switch {
	case z.EncodeLevel == "LowercaseLevelEncoder":
		return zapcore.LowercaseLevelEncoder
	case z.EncodeLevel == "LowercaseColorLevelEncoder":
		return zapcore.LowercaseColorLevelEncoder
	case z.EncodeLevel == "CapitalLevelEncoder":
		return zapcore.CapitalLevelEncoder
	case z.EncodeLevel == "CapitalColorLevelEncoder":
		return zapcore.CapitalColorLevelEncoder
	default:
		return zapcore.LowercaseLevelEncoder
	}
}
