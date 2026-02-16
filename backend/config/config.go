package config

type AppConfig struct {
	Servlet Servlet `mapstructure:"servlet" json:"servlet" yaml:"servlet"` // 系统配置
	Mysql   Mysql   `mapstructure:"mysql" json:"mysql" yaml:"mysql"`       // mysql相关配置
	Zap     Zap     `mapstructure:"zap" json:"zap" yaml:"zap"`             // 日志相关配置
	Redis   Redis   `mapstructure:"redis" json:"redis" yaml:"redis"`       // redis相关配置
}
