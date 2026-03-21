package mapper

import (
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	"gorm.io/gorm"
)

type SysResourceMapper struct{}

func (SysResourceMapper) GetResourceById(tx *gorm.DB, resourceId int64) (*entity.SysResource, error) {
	var resource *entity.SysResource
	if err := global.DB.Model(&entity.SysResource{}).Where(
		"resource_id = ? and is_delete = 0", resourceId,
	).First(&resource).Error; err != nil {
		return nil, err
	}
	return resource, nil
}
