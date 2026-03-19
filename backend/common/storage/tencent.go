package storage

import (
	"errors"
	"mime/multipart"
	"os"
)

type TencentStorage struct{}

func (a TencentStorage) PutObject(file multipart.File, relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a TencentStorage) GetObject(relativePath string) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a TencentStorage) GetAccessUrl(relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a TencentStorage) RemoveFile(relativePath string) (bool, error) {
	return false, errors.New("暂未实现")
}
