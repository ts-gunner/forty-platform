package storage

import (
	"errors"
	"mime/multipart"
	"os"
)

type LocalStorage struct{}

func (a LocalStorage) PutObject(file multipart.File, relativePath string) (StorageVo, error) {
	return StorageVo{}, errors.New("暂未实现")
}

func (a LocalStorage) GetObject(vo StorageVo) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a LocalStorage) GetAccessUrl(vo StorageVo) (string, error) {
	return "", errors.New("暂未实现")
}

func (a LocalStorage) RemoveFile(vo StorageVo) (bool, error) {
	return false, errors.New("暂未实现")
}
