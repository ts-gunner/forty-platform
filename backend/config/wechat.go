package config

type WechatConfig struct {
	Appid     string `mapstructure:"app-id" json:"app-id" yaml:"app-id"`
	Appsecret string `mapstructure:"app-secret" json:"app-secret" yaml:"app-secret"`
}
