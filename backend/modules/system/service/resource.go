package service

import (
	"context"
	"errors"
	"fmt"
	"mime"
	"mime/multipart"
	"path"
	"path/filepath"
	"strconv"
	"time"

	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/enums"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/common/storage"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type SystemResourceService struct {
}

func (s SystemResourceService) UploadResource(ctx context.Context, req request.UploadResourceRequest) (*systemResponse.SysResourceVo, error) {
	policy, err := utils.GetDefaultStorage()

	if err != nil {
		return nil, err
	}

	fileReader, err := req.File.Open()
	if err != nil {
		return nil, fmt.Errorf("resource content open failed: %w", err)
	}
	defer fileReader.Close()

	resourceId, _ := global.IdCreator.NextID()
	userId := utils.GetLoginUserId(ctx)
	ext := filepath.Ext(req.File.Filename)
	relativePath := path.Join(
		strconv.FormatInt(userId, 10),
		req.File.Filename,
	)

	result, err := policy.PutObject(fileReader, relativePath)
	if err != nil {
		return nil, fmt.Errorf("upload resource failed: %w", err)
	}
	mimeType := mime.TypeByExtension(ext)
	if mimeType == "" && req.File.Header != nil {
		mimeType = req.File.Header.Get("Content-Type")
	}

	resource := entity.SysResource{
		ResourceId:   resourceId,
		ResourceType: req.ResourceType,
		UserId:       userId,
		StorageType:  global.Config.Store.StoreType,
		RelPath:      result.RelativePath,
		PreviewUrl:   utils.GetResourceAccessPath(resourceId),
		ResourceName: filepath.Base(req.File.Filename),
		MimeType:     mimeType,
		Suffix:       ext,
		Size:         req.File.Size,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: userId,
		},
	}
	if err := global.DB.Create(&resource).Error; err != nil {
		return nil, fmt.Errorf("save resource failed: %w", err)
	}

	var vo systemResponse.SysResourceVo
	if err := copier.Copy(&vo, &resource); err != nil {
		return nil, err
	}
	return &vo, nil
}

func (SystemResourceService) GetResourceAccessUrl(resourceId int64) (string, error) {
	resource, err := resourceMapper.GetResourceById(global.DB, resourceId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("resource not found")
		}
		return "", err
	}

	policy, err := utils.GetDefaultStorage()
	if err != nil {
		return "", err
	}
	
	accessUrl, err := policy.GetAccessUrl(storage.StorageVo{
		RelativePath: resource.RelPath,
		DirectUrl:    "",
	})
	if err != nil {
		return "", err
	}
	if accessUrl == "" {
		return "", errors.New("resource access url is empty")
	}
	return accessUrl, nil
}

func (SystemResourceService) DeleteResource(ctx context.Context, resourceId int64) error {
	resource, err := resourceMapper.GetResourceById(global.DB, resourceId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("resource not found")
		}
		return err
	}

	policy, err := storage.GetPolicyByMode(global.Store, storage.StorageMode(resource.StorageType))
	if err != nil {
		return err
	}
	removed, err := policy.RemoveFile(storage.StorageVo{
		RelativePath: resource.RelPath,
		DirectUrl:    resource.PreviewUrl,
	})
	if err != nil {
		return fmt.Errorf("remove resource file failed: %w", err)
	}
	if !removed {
		return errors.New("remove resource file failed")
	}

	operatorId := utils.GetLoginUserId(ctx)
	now := time.Now().Local()
	return global.DB.Model(resource).Updates(map[string]any{
		"is_delete":   1,
		"deleter_id":  operatorId,
		"delete_time": now,
	}).Error
}

/*
*
上传头像, 使用superbed资源
*/
func (SystemResourceService) UploadAvatar(ctx context.Context, file *multipart.FileHeader) (*systemResponse.SysResourceVo, error) {
	policy, err := storage.GetPolicyByMode(global.Store, storage.SUPERBED)
	if err != nil {
		return nil, err
	}
	fileReader, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("头像内容读取失败: %w", err)
	}
	result, err := policy.PutObject(fileReader, file.Filename)
	if err != nil {
		return nil, fmt.Errorf("上传文件失败: %w", err)
	}
	ext := filepath.Ext(file.Filename)
	userId := utils.GetLoginUserId(ctx)
	resourceId, _ := global.IdCreator.NextID()
	resource := entity.SysResource{
		ResourceId:   resourceId,
		ResourceType: int(enums.SystemResourceAvatar),
		UserId:       userId,
		StorageType:  string(storage.SUPERBED),
		RelPath:      "",
		PreviewUrl:   result.DirectUrl,
		ResourceName: file.Filename,
		MimeType:     mime.TypeByExtension(ext),
		Suffix:       ext,
		Size:         file.Size,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: userId,
		},
	}
	if err := global.DB.Create(&resource).Error; err != nil {
		return nil, fmt.Errorf("资源存储失败: %w", err)
	}
	var vo systemResponse.SysResourceVo
	if err := copier.Copy(&vo, &resource); err != nil {
		return nil, err
	}
	return &vo, nil

}
