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

type RoleService struct{}

func (RoleService) GetRoleById(roleId int64) (*entity.SysRole, error) {
	var role entity.SysRole
	if err := global.DB.Where(map[string]any{
		"role_id":   roleId,
		"is_delete": 0,
	}).First(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

func (RoleService) GetRoleByKey(roleKey string) (*entity.SysRole, error) {
	var role entity.SysRole
	if err := global.DB.Where(map[string]any{
		"role_key":  roleKey,
		"is_delete": 0,
	}).First(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

func (RoleService) GetRoleList(req request.RoleListRequest) (*response.PageResult[systemResponse.RoleVo], error) {
	var roles []entity.SysRole
	var total int64

	db := global.DB.Model(&entity.SysRole{}).Where("is_delete = ?", 0)

	if req.RoleName != "" {
		db = db.Where("role_name LIKE ?", "%"+req.RoleName+"%")
	}
	if req.RoleKey != "" {
		db = db.Where("role_key LIKE ?", "%"+req.RoleKey+"%")
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
	if err := db.Order("create_time DESC").Offset(offset).Limit(req.PageSize).Find(&roles).Error; err != nil {
		return nil, err
	}

	list := make([]systemResponse.RoleVo, 0, len(roles))
	for _, role := range roles {
		list = append(list, systemResponse.RoleVo{
			RoleId:     role.RoleId,
			RoleName:   role.RoleName,
			RoleKey:    role.RoleKey,
			CreateTime: role.CreateTime,
			UpdateTime: role.UpdateTime,
		})
	}

	return &response.PageResult[systemResponse.RoleVo]{
		List:     list,
		Total:    total,
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
	}, nil
}

func (RoleService) CreateRole(ctx context.Context, req request.RoleCreateRequest) error {
	existRole, _ := RoleService{}.GetRoleByKey(req.RoleKey)
	if existRole != nil {
		return errors.New("角色标识已存在")
	}
	roleId, _ := global.IdCreator.NextID()
	role := entity.SysRole{
		RoleId:   roleId,
		RoleName: req.RoleName,
		RoleKey:  req.RoleKey,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: utils.GetLoginUserId(ctx),
		},
	}

	return global.DB.Create(&role).Error
}

func (RoleService) UpdateRole(ctx context.Context, req request.RoleUpdateRequest) error {
	role, err := RoleService{}.GetRoleById(req.RoleId)
	if err != nil {
		return errors.New("角色不存在")
	}

	updates := map[string]any{}
	if req.RoleName != "" {
		updates["role_name"] = req.RoleName
	}
	if req.RoleKey != "" {
		existRole, _ := RoleService{}.GetRoleByKey(req.RoleKey)
		if existRole != nil && existRole.RoleId != req.RoleId {
			return errors.New("角色标识已存在")
		}
		updates["role_key"] = req.RoleKey
	}

	if len(updates) == 0 {
		return nil
	}

	updaterId := utils.GetLoginUserId(ctx)
	updates["updater_id"] = updaterId

	return global.DB.Model(role).Updates(updates).Error
}

func (RoleService) DeleteRole(ctx context.Context, roleId int64) error {
	role, err := RoleService{}.GetRoleById(roleId)
	if err != nil {
		return errors.New("角色不存在")
	}

	deleterId := utils.GetLoginUserId(ctx)
	return global.DB.Model(role).Updates(map[string]any{
		"is_delete":  1,
		"deleter_id": deleterId,
	}).Error
}

func (RoleService) GetRoleDetail(roleId int64) (*systemResponse.RoleVo, error) {
	role, err := RoleService{}.GetRoleById(roleId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("角色不存在")
		}
		return nil, err
	}

	return &systemResponse.RoleVo{
		RoleId:     role.RoleId,
		RoleName:   role.RoleName,
		RoleKey:    role.RoleKey,
		CreateTime: role.CreateTime,
		UpdateTime: role.UpdateTime,
	}, nil
}
