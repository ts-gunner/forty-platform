package storage

import (
	"fmt"
	"mime/multipart"
	"os"
)

type StorageVo struct {
	RelativePath string // 相对路径
	DirectUrl    string // 直接访问的url

}
type StoragePolicy interface {
	PutObject(file multipart.File, relativePath string) (StorageVo, error) // 上传文件

	GetObject(vo StorageVo) (os.File, error) // 下载文件，返回文件流对象

	GetAccessUrl(vo StorageVo) (string, error) // 获取访问链接

	RemoveFile(vo StorageVo) (bool, error) //删除文件
}

type StorageMode string

const (
	SUPERBED StorageMode = "superbed"
	ALIYUN   StorageMode = "aliyun"
	TENCENT  StorageMode = "tencent"
	LOCAL    StorageMode = "local"
	MINIO    StorageMode = "minio"
)

func Register(drivers map[StorageMode]StoragePolicy, driverName StorageMode, policy StoragePolicy) {
	drivers[driverName] = policy
}

func GetPolicyByMode(drivers map[StorageMode]StoragePolicy, mode StorageMode) (StoragePolicy, error) {
	if driver, ok := drivers[mode]; ok {
		return driver, nil
	}
	return nil, fmt.Errorf("storage mode [%s] not supported", mode)
}
