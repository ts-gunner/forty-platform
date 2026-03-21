package storage

import (
	"errors"
	"mime/multipart"
	"os"

	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
)

type TencentStorage struct{}

func (a TencentStorage) PutObject(file multipart.File, relativePath string) (systemResponse.StorageVo, error) {
	return systemResponse.StorageVo{}, errors.New("暂未实现")
}

func (a TencentStorage) GetObject(vo systemResponse.StorageVo) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a TencentStorage) GetAccessUrl(vo systemResponse.StorageVo) (string, error) {
	return "", errors.New("暂未实现")
}

func (a TencentStorage) RemoveFile(vo systemResponse.StorageVo) (bool, error) {
	return false, errors.New("暂未实现")
}
