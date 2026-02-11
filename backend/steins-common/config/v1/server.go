package v1

type ServerConfig struct {
	Port        int    `mapstructure:"port" json:"port" yaml:"port"`                         // 端口号
	ContextPath string `mapstructure:"context-path" json:"context-path" yaml:"context-path"` // 路径前缀
}
