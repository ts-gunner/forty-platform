package storage

import (
	"errors"
	"mime/multipart"
	"os"
)

type AliyunStorage struct{}

func (a AliyunStorage) PutObject(file multipart.File, relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a AliyunStorage) GetObject(relativePath string) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a AliyunStorage) GetAccessUrl(relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a AliyunStorage) RemoveFile(relativePath string) (bool, error) {
	return false, errors.New("暂未实现")
}
