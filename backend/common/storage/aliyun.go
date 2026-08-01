package storage

import (
	"context"
	"fmt"
	"mime"
	"mime/multipart"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	"github.com/aliyun/alibabacloud-oss-go-sdk-v2/oss"
	"github.com/aliyun/alibabacloud-oss-go-sdk-v2/oss/credentials"
)

type AliyunStorage struct {
	client          *oss.Client
	AccessKeyId     string
	AccessKeySecret string
	Region          string
	BucketName      string
	AccessPrefixUrl string
	BaseRelPath     string
}

func (a *AliyunStorage) InitClient() {
	provider := credentials.NewStaticCredentialsProvider(a.AccessKeyId, a.AccessKeySecret, "")
	cfg := oss.LoadDefaultConfig().
		WithCredentialsProvider(provider).
		WithRegion(a.Region)

	a.client = oss.NewClient(cfg)
}

func (a *AliyunStorage) PutObject(file multipart.File, relativePath string) (StorageVo, error) {
	var vo StorageVo
	if file == nil {
		return vo, fmt.Errorf("file cannot be nil")
	}
	if err := a.ensureClient(); err != nil {
		return vo, err
	}
	objectKey, err := a.objectKey(relativePath)
	if err != nil {
		return vo, err
	}

	request := &oss.PutObjectRequest{
		Bucket: &a.BucketName,
		Key:    &objectKey,
		Body:   file,
	}
	if contentType := mime.TypeByExtension(filepath.Ext(relativePath)); contentType != "" {
		request.ContentType = oss.Ptr(contentType)
	}
	if _, err := a.client.PutObject(context.Background(), request); err != nil {
		return vo, fmt.Errorf("aliyun oss put object failed: %w", err)
	}

	vo.RelativePath = objectKey
	return vo, nil
}

func (a *AliyunStorage) GetObject(vo StorageVo) (os.File, error) {
	var zero os.File
	if err := a.ensureClient(); err != nil {
		return zero, err
	}
	objectKey, err := a.objectKeyFromVo(vo)
	if err != nil {
		return zero, err
	}

	tmpFile, err := os.CreateTemp("", "aliyun-oss-*")
	if err != nil {
		return zero, fmt.Errorf("create temp file failed: %w", err)
	}
	if _, err := a.client.GetObjectToFile(context.Background(), &oss.GetObjectRequest{
		Bucket: &a.BucketName,
		Key:    &objectKey,
	}, tmpFile.Name()); err != nil {
		_ = tmpFile.Close()
		_ = os.Remove(tmpFile.Name())
		return zero, fmt.Errorf("aliyun oss get object failed: %w", err)
	}
	if _, err := tmpFile.Seek(0, 0); err != nil {
		_ = tmpFile.Close()
		_ = os.Remove(tmpFile.Name())
		return zero, fmt.Errorf("seek temp file failed: %w", err)
	}

	return *tmpFile, nil
}

func (a *AliyunStorage) GetAccessUrl(vo StorageVo) (string, error) {

	if err := a.ensureClient(); err != nil {
		return "", err
	}
	objectKey, err := a.objectKeyFromVo(vo)
	if err != nil {
		return "", err
	}

	return a.presignedAccessUrl(objectKey)
}

func (a *AliyunStorage) RemoveFile(vo StorageVo) (bool, error) {
	if err := a.ensureClient(); err != nil {
		return false, err
	}
	objectKey, err := a.objectKeyFromVo(vo)
	if err != nil {
		return false, err
	}
	if _, err := a.client.DeleteObject(context.Background(), &oss.DeleteObjectRequest{
		Bucket: &a.BucketName,
		Key:    &objectKey,
	}); err != nil {
		return false, fmt.Errorf("aliyun oss delete object failed: %w", err)
	}
	return true, nil
}

func (a *AliyunStorage) ensureClient() error {
	if strings.TrimSpace(a.BucketName) == "" {
		return fmt.Errorf("aliyun oss bucket name is required")
	}
	if strings.TrimSpace(a.Region) == "" {
		return fmt.Errorf("aliyun oss region is required")
	}
	if strings.TrimSpace(a.AccessKeyId) == "" || strings.TrimSpace(a.AccessKeySecret) == "" {
		return fmt.Errorf("aliyun oss access key is required")
	}
	if a.client == nil {
		a.InitClient()
	}
	return nil
}

func (a *AliyunStorage) objectKey(relativePath string) (string, error) {
	relativePath = strings.TrimSpace(relativePath)
	if relativePath == "" {
		return "", fmt.Errorf("relative path cannot be empty")
	}

	relativePath = filepath.ToSlash(relativePath)
	if filepath.IsAbs(relativePath) || strings.Contains(relativePath, ":/") {
		relativePath = path.Base(relativePath)
	}
	relativePath = strings.Trim(relativePath, "/")

	baseRelPath := strings.Trim(filepath.ToSlash(a.BaseRelPath), "/")
	if baseRelPath == "" {
		return relativePath, nil
	}
	return path.Join(baseRelPath, relativePath), nil
}

func (a *AliyunStorage) objectKeyFromVo(vo StorageVo) (string, error) {
	if vo.RelativePath != "" {
		objectKey := strings.Trim(filepath.ToSlash(vo.RelativePath), "/")
		if filepath.IsAbs(objectKey) || strings.Contains(objectKey, ":/") {
			objectKey = path.Base(objectKey)
		}
		baseRelPath := strings.Trim(filepath.ToSlash(a.BaseRelPath), "/")
		if baseRelPath != "" && objectKey != baseRelPath && !strings.HasPrefix(objectKey, baseRelPath+"/") {
			objectKey = path.Join(baseRelPath, objectKey)
		}
		if objectKey == "" {
			return "", fmt.Errorf("storage relative path cannot be empty")
		}
		return objectKey, nil
	}
	if vo.DirectUrl == "" {
		return "", fmt.Errorf("storage relative path cannot be empty")
	}
	prefix := strings.TrimRight(a.AccessPrefixUrl, "/")
	if prefix != "" && strings.HasPrefix(vo.DirectUrl, prefix+"/") {
		return strings.TrimPrefix(vo.DirectUrl, prefix+"/"), nil
	}
	return "", fmt.Errorf("storage relative path cannot be parsed from direct url")
}

func (a *AliyunStorage) buildAccessUrl(objectKey string) string {
	if strings.TrimSpace(a.AccessPrefixUrl) == "" {
		return ""
	}
	return strings.TrimRight(a.AccessPrefixUrl, "/") + "/" + strings.TrimLeft(objectKey, "/")
}

func (a *AliyunStorage) presignedAccessUrl(objectKey string) (string, error) {
	result, err := a.client.Presign(context.Background(), &oss.GetObjectRequest{
		Bucket: &a.BucketName,
		Key:    &objectKey,
	}, oss.PresignExpires(15*time.Minute))
	if err != nil {
		return "", fmt.Errorf("aliyun oss presign object failed: %w", err)
	}
	return result.URL, nil
}
