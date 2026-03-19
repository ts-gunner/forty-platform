package storage

import (
	"errors"
	"mime/multipart"
	"os"
)

type LocalStorage struct{}

func (a LocalStorage) PutObject(file multipart.File, relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a LocalStorage) GetObject(relativePath string) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a LocalStorage) GetAccessUrl(relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a LocalStorage) RemoveFile(relativePath string) (bool, error) {
	return false, errors.New("暂未实现")
}
