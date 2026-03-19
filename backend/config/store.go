package config

type StoreConfig struct {
	StoreType       string `mapstructure:"store-type" json:"store-type" yaml:"store-type"`                      // 存储类型， local | aliyun | minio
	AccessPrefixUrl string `mapstructure:"access-prefix-url" json:"access-prefix-url" yaml:"access-prefix-url"` // 访问资源的前缀路径
	BaseRelPath     string `mapstructure:"base-rel-path" json:"base-rel-path" yaml:"base-rel-path"`             // 存储的相对路径
}
