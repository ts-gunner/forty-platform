package storage

import (
	"mime/multipart"
	"os"
)

type StoragePolicy interface {
	/**
	上传文件
	*/
	PutObject(file multipart.File, relativePath string) (string, error)

	/**
	下载文件，返回文件流对象
	*/
	GetObject(relativePath string) (os.File, error)

	/**
	获取访问链接
	*/
	GetAccessUrl(relativePath string) (string, error)

	/**
	删除文件
	*/
	RemoveFile(relativePath string) (bool, error)
}
