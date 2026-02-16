package config

type DsnProvider interface {
	Dsn() string
}
type CommonDB struct {
	Path         string `mapstructure:"path" json:"path" yaml:"path"`             // 地址 | 路径
	Port         string `mapstructure:"port" json:"port" yaml:"port"`             // 端口号
	DbName       string `mapstructure:"db-name" json:"db-name" yaml:"db-name"`    // 数据库名
	Username     string `mapstructure:"username" json:"username" yaml:"username"` // 用户名
	Password     string `mapstructure:"password" json:"password" yaml:"password"` // 密码
	MaxIdleConns int    `json:"max-idle-conns" yaml:"max-idle-conns"`             // 空闲中最大的连接数
	MaxOpenConns int    `json:"max-open-conns" yaml:"max-open-conns"`             // 打开数据库的最大连接数
}
