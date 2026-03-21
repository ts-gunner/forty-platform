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
	return drivers
}
