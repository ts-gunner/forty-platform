package v1

type ApplicationConfig struct {
	Server ServerConfig `mapstructure:"server" json:"server" yaml:"server"` // 服务相关配置
}
