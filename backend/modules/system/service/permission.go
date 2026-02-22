package service

import (
	"context"
	"errors"

	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type PermissionService struct{}

func (PermissionService) GetPermissionById(permissionId int64) (*entity.SysPermission, error) {
	var permission entity.SysPermission
	if err := global.DB.Where(map[string]any{
		"permission_id": permissionId,
		"is_delete":     0,
	}).First(&permission).Error; err != nil {
		return nil, err
	}
	return &permission, nil
}

func (PermissionService) GetPermissionByPerms(perms string) (*entity.SysPermission, error) {
	var permission entity.SysPermission
	if err := global.DB.Where(map[string]any{
		"perms":     perms,
		"is_delete": 0,
	}).First(&permission).Error; err != nil {
		return nil, err
	}
	return &permission, nil
}

func (PermissionService) GetPermissionList(req request.PermissionListRequest) (*response.PageResult[systemResponse.PermissionVo], error) {
	var permissions []entity.SysPermission
	var total int64

	db := global.DB.Model(&entity.SysPermission{}).Where("is_delete = ?", 0)

	if req.PermissionName != "" {
		db = db.Where("permission_name LIKE ?", "%"+req.PermissionName+"%")
	}
	if req.Type != nil {
		db = db.Where("type = ?", *req.Type)
	}
	if req.Perms != "" {
		db = db.Where("perms LIKE ?", "%"+req.Perms+"%")
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, err
	}

	if req.PageNum <= 0 {
		req.PageNum = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}

	offset := (req.PageNum - 1) * req.PageSize
	if err := db.Order("create_time DESC").Offset(offset).Limit(req.PageSize).Find(&permissions).Error; err != nil {
		return nil, err
	}

	list := make([]systemResponse.PermissionVo, 0, len(permissions))
	for _, permission := range permissions {
		list = append(list, systemResponse.PermissionVo{
			PermissionId:   permission.PermissionId,
			PermissionName: permission.PermissionName,
			Type:           permission.Type,
			Perms:          permission.Perms,
			CreateTime:     permission.CreateTime,
			UpdateTime:     permission.UpdateTime,
		})
	}

	return &response.PageResult[systemResponse.PermissionVo]{
		List:     list,
		Total:    total,
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
	}, nil
}

func (PermissionService) CreatePermission(ctx context.Context, req request.PermissionCreateRequest) error {
	if req.Perms != "" {
		existPerm, _ := PermissionService{}.GetPermissionByPerms(req.Perms)
		if existPerm != nil {
			return errors.New("权限标识已存在")
		}
	}
	permId, _ := global.IdCreator.NextID()
	permission := entity.SysPermission{
		PermissionId:   permId,
		PermissionName: req.PermissionName,
		Type:           req.Type,
		Perms:          req.Perms,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: utils.GetLoginUserId(ctx),
		},
	}

	return global.DB.Create(&permission).Error
}

func (PermissionService) UpdatePermission(ctx context.Context, req request.PermissionUpdateRequest) error {
	permission, err := PermissionService{}.GetPermissionById(req.PermissionId)
	if err != nil {
		return errors.New("权限不存在")
	}

	updates := map[string]any{}
	if req.PermissionName != "" {
		updates["permission_name"] = req.PermissionName
	}
	if req.Type != nil {
		updates["type"] = *req.Type
	}
	if req.Perms != "" {
		existPerm, _ := PermissionService{}.GetPermissionByPerms(req.Perms)
		if existPerm != nil && existPerm.PermissionId != req.PermissionId {
			return errors.New("权限标识已存在")
		}
		updates["perms"] = req.Perms
	}

	if len(updates) == 0 {
		return nil
	}

	updaterId := utils.GetLoginUserId(ctx)
	updates["updater_id"] = updaterId

	return global.DB.Model(permission).Updates(updates).Error
}

func (PermissionService) DeletePermission(ctx context.Context, permissionId int64) error {
	permission, err := PermissionService{}.GetPermissionById(permissionId)
	if err != nil {
		return errors.New("权限不存在")
	}

	deleterId := utils.GetLoginUserId(ctx)
	return global.DB.Model(permission).Updates(map[string]any{
		"is_delete":  1,
		"deleter_id": deleterId,
	}).Error
}

func (PermissionService) GetPermissionDetail(permissionId int64) (*systemResponse.PermissionVo, error) {
	permission, err := PermissionService{}.GetPermissionById(permissionId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("权限不存在")
		}
		return nil, err
	}

	return &systemResponse.PermissionVo{
		PermissionId:   permission.PermissionId,
		PermissionName: permission.PermissionName,
		Type:           permission.Type,
		Perms:          permission.Perms,
		CreateTime:     permission.CreateTime,
		UpdateTime:     permission.UpdateTime,
	}, nil
}
