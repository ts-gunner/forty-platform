package config

/*
*
程序基础配置
*/
type Servlet struct {
	Port        string `mapstructure:"port" json:"port" yaml:"port"`
	DbType      string `mapstructure:"db-type" json:"db-type" yaml:"db-type"`                // 数据库类型：mysql|sqlite|sqlserver|postgresql
	OssType     string `mapstructure:"oss-type" json:"oss-type" yaml:"oss-type"`             // 对象存储类型，local, aliyun, tencent
	ContextPath string `mapstructure:"context-path" json:"context-path" yaml:"context-path"` // 路径前缀
}
