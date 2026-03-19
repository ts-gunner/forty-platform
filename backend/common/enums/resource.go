package enums

type SysResourceType int

const (
	SystemResourceAvatar SysResourceType = iota + 1 // 头像
	SystemResourceCrm                               // 客户系统相关资源

)

type StorageType int

const (
	StorageLocal     StorageType = iota + 1 // 本地
	StorageAliyunOss                        // 阿里云对象存储
	StorageMinio                            // Minio对象存储
)
