package storage

import (
	"errors"
	"mime/multipart"
	"os"
)

type MinioStorage struct{}

func (a MinioStorage) PutObject(file multipart.File, relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a MinioStorage) GetObject(relativePath string) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a MinioStorage) GetAccessUrl(relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a MinioStorage) RemoveFile(relativePath string) (bool, error) {
	return false, errors.New("暂未实现")
}
