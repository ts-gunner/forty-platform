package config

type BaseStoreField struct {
	AccessPrefixUrl string `mapstructure:"access-prefix-url" json:"access-prefix-url" yaml:"access-prefix-url"` // 访问资源的前缀路径
	BaseRelPath     string `mapstructure:"base-rel-path" json:"base-rel-path" yaml:"base-rel-path"`             // 存储的相对路径
}

type BaseCloudField struct {
	AccessKeyId     string `mapstructure:"access-key-id" json:"access-key-id" yaml:"access-key-id"`
	AccessKeySecret string `mapstructure:"access-key-secret" json:"access-key-secret" yaml:"access-key-secret"`
}

type StoreConfig struct {
	StoreType string         `mapstructure:"store-type" json:"store-type" yaml:"store-type"` // 默认存储类型， superbed | local | aliyun | minio
	SuperBed  SuperBedConfig `mapstructure:"super-bed" json:"super-bed" yaml:"super-bed"`    // 聚合图床的存储
	Aliyun    AliyunConfig   `mapstructure:"aliyun" json:"aliyun" yaml:"aliyun"`             // 阿里云存储
	Tencent   TencentConfig  `mapstructure:"tencent" json:"tencent" yaml:"tencent"`          // 腾讯云存储
	Minio     MinioConfig    `mapstructure:"minio" json:"minio" yaml:"minio"`                // minio对象存储

}

type SuperBedConfig struct {
	BaseStoreField `mapstructure:",squash" yaml:",inline"`
}

type AliyunConfig struct {
	BaseCloudField `mapstructure:",squash" yaml:",inline"`
	BaseStoreField `mapstructure:",squash" yaml:",inline"`
}

type TencentConfig struct {
	BaseCloudField `mapstructure:",squash" yaml:",inline"`
	BaseStoreField `mapstructure:",squash" yaml:",inline"`
}

type MinioConfig struct {
	BaseStoreField `mapstructure:",squash" yaml:",inline"`
}
