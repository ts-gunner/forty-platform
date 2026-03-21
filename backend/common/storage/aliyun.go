package storage

import (
	"errors"
	"mime/multipart"
	"os"
)

type AliyunStorage struct{}

func (a AliyunStorage) PutObject(file multipart.File, relativePath string) (StorageVo, error) {
	return StorageVo{}, errors.New("暂未实现")
}

func (a AliyunStorage) GetObject(vo StorageVo) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a AliyunStorage) GetAccessUrl(vo StorageVo) (string, error) {
	return "", errors.New("暂未实现")
}

func (a AliyunStorage) RemoveFile(vo StorageVo) (bool, error) {
	return false, errors.New("暂未实现")
}
