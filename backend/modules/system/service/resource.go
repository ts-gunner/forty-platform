package service

import (
	"context"
	"fmt"
	"mime"
	"mime/multipart"
	"path/filepath"

	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/enums"
	"github.com/ts-gunner/forty-platform/common/global"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/common/storage"
	"github.com/ts-gunner/forty-platform/common/utils"
)

type SystemResourceService struct {
}

/*
*
上传头像
*/
func (SystemResourceService) UploadAvatar(ctx context.Context, file *multipart.FileHeader) (*systemResponse.SysResourceVo, error) {
	policy, err := storage.GetPolicyByMode(global.Store, storage.SUPERBED)
	if err != nil {
		return nil, err
	}
	fileReader, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("头像内容读取失败:" + err.Error())
	}
	result, err := policy.PutObject(fileReader, file.Filename)
	if err != nil {
		return nil, fmt.Errorf("上传文件失败:" + err.Error())
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
		return nil, fmt.Errorf("资源存储失败:" + err.Error())
	}
	var vo systemResponse.SysResourceVo
	if err := copier.Copy(&vo, &resource); err != nil {
		return nil, err
	}
	return &vo, nil

}
