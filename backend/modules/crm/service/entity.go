package service

import (
	"context"
	"errors"

	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type EntityService struct{}

func (EntityService) GetEntityByCode(entityCode string) (*entity.CrmCustomerEntity, error) {
	var entityObj entity.CrmCustomerEntity
	if err := global.DB.Where(map[string]any{
		"entity_code": entityCode,
		"is_delete":   0,
	}).First(&entityObj).Error; err != nil {
		return nil, err
	}
	return &entityObj, nil
}

func (EntityService) GetCrmEntityList(req request.GetEntityListRequest) (*response.PageResult[crmResponse.CrmEntityVo], error) {
	var entities []entity.CrmCustomerEntity
	var total int64

	db := global.DB.Model(&entity.CrmCustomerEntity{}).Where("is_delete = ?", 0)

	if req.EntityName != "" {
		db = db.Where("entity_name LIKE ?", "%"+req.EntityName+"%")
	}
	if req.EntityCode != "" {
		db = db.Where("entity_code LIKE ?", "%"+req.EntityCode+"%")
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
	if err := db.Offset(offset).Limit(req.PageSize).Find(&entities).Error; err != nil {
		return nil, err
	}

	list := make([]crmResponse.CrmEntityVo, 0, len(entities))
	for _, e := range entities {
		list = append(list, crmResponse.CrmEntityVo{
			EntityId:    e.Id,
			EntityName:  e.EntityName,
			EntityCode:  e.EntityCode,
			Description: e.Description,
			CreateTime:  e.CreateTime,
			UpdateTime:  e.UpdateTime,
		})
	}

	return &response.PageResult[crmResponse.CrmEntityVo]{
		List:     list,
		Total:    total,
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
	}, nil
}

func (s EntityService) CreateEntity(ctx context.Context, req request.EntityCreateRequest) error {
	existEntity, _ := s.GetEntityByCode(req.EntityCode)
	if existEntity != nil {
		return errors.New("实体标识已存在")
	}

	entityObj := entity.CrmCustomerEntity{
		EntityName:  req.EntityName,
		EntityCode:  req.EntityCode,
		Description: req.Description,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: utils.GetLoginUserId(ctx),
		},
	}

	return global.DB.Create(&entityObj).Error
}

func (s EntityService) UpdateEntity(ctx context.Context, req request.EntityUpdateRequest) error {
	entityObj, err := entityMapper.GetEntityById(req.EntityId)
	if err != nil {
		return errors.New("实体不存在")
	}

	updates := map[string]any{}
	if req.EntityName != "" {
		updates["entity_name"] = req.EntityName
	}
	if req.EntityCode != "" {
		existEntity, _ := s.GetEntityByCode(req.EntityCode)
		if existEntity != nil && existEntity.Id != req.EntityId {
			return errors.New("实体标识已存在")
		}
		updates["entity_code"] = req.EntityCode
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}

	if len(updates) == 0 {
		return nil
	}

	updaterId := utils.GetLoginUserId(ctx)
	updates["updater_id"] = updaterId

	return global.DB.Model(entityObj).Updates(updates).Error
}

func (s EntityService) DeleteEntity(ctx context.Context, entityId int64) error {
	entityObj, err := entityMapper.GetEntityById(entityId)
	if err != nil {
		return errors.New("实体不存在")
	}

	deleterId := utils.GetLoginUserId(ctx)
	return global.DB.Model(entityObj).Updates(map[string]any{
		"is_delete":  1,
		"deleter_id": deleterId,
	}).Error
}

func (s EntityService) GetEntityDetail(entityId int64) (*crmResponse.CrmEntityVo, error) {
	entityObj, err := entityMapper.GetEntityById(entityId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("实体不存在")
		}
		return nil, err
	}

	return &crmResponse.CrmEntityVo{
		EntityId:    entityObj.Id,
		EntityName:  entityObj.EntityName,
		EntityCode:  entityObj.EntityCode,
		Description: entityObj.Description,
		CreateTime:  entityObj.CreateTime,
		UpdateTime:  entityObj.UpdateTime,
	}, nil
}
