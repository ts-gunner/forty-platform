package core

import (
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/storage"
)

func InitializeStore() map[storage.StorageMode]storage.StoragePolicy {
	drivers := make(map[storage.StorageMode]storage.StoragePolicy)
	if global.Config.Store.SuperBed.Enable {
		storage.Register(drivers, storage.SUPERBED, storage.SuperBedStorage{
			Token: global.Config.Store.SuperBed.Token,
		})
	}
	if global.Config.Store.Aliyun.Enable {
		st := &storage.AliyunStorage{
			AccessKeyId:     global.Config.Store.Aliyun.AccessKeyId,
			AccessKeySecret: global.Config.Store.Aliyun.AccessKeySecret,
			Region:          global.Config.Store.Aliyun.Region,
			BucketName:      global.Config.Store.Aliyun.BucketName,
			BaseRelPath:     global.Config.Store.Aliyun.BaseRelPath,
		}
		st.InitClient()
		storage.Register(drivers, storage.ALIYUN, st)
	}
	return drivers
}

func GetDefaultStorage() (storage.StoragePolicy, error) {
	switch storage.StorageMode(global.Config.Store.StoreType) {
	case storage.SUPERBED:
		return storage.GetPolicyByMode(global.Store, storage.SUPERBED)
	case storage.ALIYUN:
		return storage.GetPolicyByMode(global.Store, storage.ALIYUN)
	case storage.TENCENT:
		return storage.GetPolicyByMode(global.Store, storage.TENCENT)
	default:
		return storage.GetPolicyByMode(global.Store, storage.LOCAL)
	}

}
