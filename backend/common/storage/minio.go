package storage

import (
	"errors"
	"mime/multipart"
	"os"
)

type MinioStorage struct{}

func (a MinioStorage) PutObject(file multipart.File, relativePath string) (StorageVo, error) {
	return StorageVo{}, errors.New("暂未实现")
}

func (a MinioStorage) GetObject(vo StorageVo) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a MinioStorage) GetAccessUrl(vo StorageVo) (string, error) {
	return "", errors.New("暂未实现")
}

func (a MinioStorage) RemoveFile(vo StorageVo) (bool, error) {
	return false, errors.New("暂未实现")
}
