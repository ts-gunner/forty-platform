package utils

import (
	"fmt"
	"strings"

	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/storage"
)

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

func GetResourceAccessPath(resourceId int64) string {
	contextPath := strings.TrimRight(global.Config.Servlet.ContextPath, "/")
	return fmt.Sprintf("%s/system/resource/access/%d", contextPath, resourceId)
}
