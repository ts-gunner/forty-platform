package storage

import (
	"errors"
	"mime/multipart"
	"os"

	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
)

type LocalStorage struct{}

func (a LocalStorage) PutObject(file multipart.File, relativePath string) (systemResponse.StorageVo, error) {
	return systemResponse.StorageVo{}, errors.New("暂未实现")
}

func (a LocalStorage) GetObject(vo systemResponse.StorageVo) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a LocalStorage) GetAccessUrl(vo systemResponse.StorageVo) (string, error) {
	return "", errors.New("暂未实现")
}

func (a LocalStorage) RemoveFile(vo systemResponse.StorageVo) (bool, error) {
	return false, errors.New("暂未实现")
}
