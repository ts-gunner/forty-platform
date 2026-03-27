package service

import (
	"context"
	"errors"

	"github.com/samber/lo"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	response "github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type CustomerFavoriteService struct{}

func (CustomerFavoriteService) AddFavorite(ctx context.Context, req request.AddCustomerFavoriteRequest) error {
	userId := utils.GetLoginUserId(ctx)

	// 检查是否已经收藏
	var existingFavorite entity.CrmCustomerFavorite
	err := global.DB.Where("entity_id = ? AND value_id = ? AND user_id = ?", req.EntityId, req.ValueId, userId).First(&existingFavorite).Error
	if err == nil {
		return errors.New("该记录已经收藏")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// 生成新ID
	newId, err := global.IdCreator.NextID()
	if err != nil {
		return err
	}

	favorite := entity.CrmCustomerFavorite{
		Id:       newId,
		EntityId: req.EntityId,
		ValueId:  req.ValueId,
		UserId:   userId,
	}

	if err := global.DB.Create(&favorite).Error; err != nil {
		return err
	}

	return nil
}

func (CustomerFavoriteService) RemoveFavorite(ctx context.Context, req request.RemoveCustomerFavoriteRequest) error {
	userId := utils.GetLoginUserId(ctx)

	result := global.DB.Where("entity_id = ? AND value_id = ? AND user_id = ?", req.EntityId, req.ValueId, userId).Delete(&entity.CrmCustomerFavorite{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("收藏记录不存在")
	}

	return nil
}

func (CustomerFavoriteService) GetFavoriteList(ctx context.Context, req request.GetCustomerFavoriteListRequest) (*response.PageResult[crmResponse.CrmCustomerFavoriteVo], error) {
	userId := utils.GetLoginUserId(ctx)

	if req.PageNum <= 0 {
		req.PageNum = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}

	// 构建查询
	db := global.DB.Model(&entity.CrmCustomerFavorite{}).Where("user_id = ?", userId)

	if req.EntityId > 0 {
		db = db.Where("entity_id = ?", req.EntityId)
	}

	// 获取总数
	var total int64
	if err := db.Count(&total).Error; err != nil {
		return nil, err
	}

	// 分页查询
	offset := (req.PageNum - 1) * req.PageSize
	var favorites []entity.CrmCustomerFavorite
	if err := db.Order("create_time DESC").Offset(offset).Limit(req.PageSize).Find(&favorites).Error; err != nil {
		return nil, err
	}

	// 获取收藏记录的详细信息
	favoriteVos := make([]crmResponse.CrmCustomerFavoriteVo, 0, len(favorites))
	for _, fav := range favorites {
		// 获取实体信息
		entityObj, err := entityMapper.GetEntityById(fav.EntityId)
		if err != nil {
			continue
		}

		// 获取客户数据
		var customerValue entity.CrmCustomerValues
		if err := global.DB.Where("id = ?", fav.ValueId).First(&customerValue).Error; err != nil {
			continue
		}

		favoriteVo := crmResponse.CrmCustomerFavoriteVo{
			Id:           fav.Id,
			EntityId:     fav.EntityId,
			EntityName:   entityObj.EntityName,
			ValueId:      fav.ValueId,
			CustomerName: customerValue.CustomerName,
			Remark:       customerValue.Remark,
			Values:       customerValue.Values.String(),
		}
		favoriteVos = append(favoriteVos, favoriteVo)
	}

	return &response.PageResult[crmResponse.CrmCustomerFavoriteVo]{
		List:     favoriteVos,
		Total:    total,
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
	}, nil
}

func (CustomerFavoriteService) CheckFavorite(ctx context.Context, entityId int64, valueId int64) (bool, error) {
	userId := utils.GetLoginUserId(ctx)

	var count int64
	if err := global.DB.Model(&entity.CrmCustomerFavorite{}).Where("entity_id = ? AND value_id = ? AND user_id = ?", entityId, valueId, userId).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (CustomerFavoriteService) GetFavoriteByValueId(ctx context.Context, entityId int64, valueId int64) (*entity.CrmCustomerFavorite, error) {
	userId := utils.GetLoginUserId(ctx)

	var favorite entity.CrmCustomerFavorite
	if err := global.DB.Where("entity_id = ? AND value_id = ? AND user_id = ?", entityId, valueId, userId).First(&favorite).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &favorite, nil
}

func (CustomerFavoriteService) GetFavoriteIdsByEntityId(ctx context.Context, entityId int64) ([]int64, error) {
	userId := utils.GetLoginUserId(ctx)

	var favorites []entity.CrmCustomerFavorite
	if err := global.DB.Where("entity_id = ? AND user_id = ?", entityId, userId).Find(&favorites).Error; err != nil {
		return nil, err
	}

	return lo.Map(favorites, func(fav entity.CrmCustomerFavorite, idx int) int64 {
		return fav.ValueId
	}), nil
}
