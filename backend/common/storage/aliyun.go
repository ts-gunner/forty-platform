package storage

import (
	"errors"
	"mime/multipart"
	"os"

	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
)

type AliyunStorage struct{}

func (a AliyunStorage) PutObject(file multipart.File, relativePath string) (systemResponse.StorageVo, error) {
	return systemResponse.StorageVo{}, errors.New("暂未实现")
}

func (a AliyunStorage) GetObject(vo systemResponse.StorageVo) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a AliyunStorage) GetAccessUrl(vo systemResponse.StorageVo) (string, error) {
	return "", errors.New("暂未实现")
}

func (a AliyunStorage) RemoveFile(vo systemResponse.StorageVo) (bool, error) {
	return false, errors.New("暂未实现")
}
