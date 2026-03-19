package storage

import (
	"mime/multipart"
	"os"
)

type StoragePolicy interface {
	/**
	上传文件
	*/
	putObject(file multipart.File, relativePath string) (string, error)

	/**
	下载文件，返回文件流对象
	*/
	getObject(relativePath string) (os.File, error)

	/**
	获取访问链接
	*/
	getUrl(relativePath string) (string, error)

	/**
	删除文件
	*/
	removeFile(relativePath string) (bool, error)
}
