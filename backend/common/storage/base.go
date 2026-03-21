package storage

import (
	"mime/multipart"
	"os"

	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
)

type StoragePolicy interface {
	/**
	上传文件
	*/
	PutObject(file multipart.File, relativePath string) (systemResponse.StorageVo, error)

	/**
	下载文件，返回文件流对象
	*/
	GetObject(vo systemResponse.StorageVo) (os.File, error)

	/**
	获取访问链接
	*/
	GetAccessUrl(vo systemResponse.StorageVo) (string, error)

	/**
	删除文件
	*/
	RemoveFile(vo systemResponse.StorageVo) (bool, error)
}

type StorageService struct {
	Mode string
}

func (s StorageService) PutObject(file multipart.File, relativePath string) (systemResponse.StorageVo, error) {
	return systemResponse.StorageVo{}, nil
}
