package service

import (
	"context"
	"errors"

	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	auditRequest "github.com/ts-gunner/forty-platform/common/request/audit"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type ReviewService struct{}

// UpdateAudit 审核或驳回
func (ReviewService) UpdateAudit(ctx context.Context, req auditRequest.UpdateAuditRequest) error {
	userId := utils.GetLoginUserId(ctx)

	// 检查审核记录是否存在
	var audit entity.AuditAccessRecord
	if err := global.DB.First(&audit, req.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("审核记录不存在")
		}
		return err
	}

	// 检查状态是否合法
	if req.Status != 1 && req.Status != 2 {
		return errors.New("状态值不合法，只能是1(通过)或2(驳回)")
	}

	// 更新审核记录
	if err := global.DB.Model(&audit).Updates(map[string]interface{}{
		"status":     req.Status,
		"remark":     req.Remark,
		"updater_id": userId,
	}).Error; err != nil {
		global.Logger.Error("更新审核记录失败:" + err.Error())
		return errors.New("更新审核记录失败")
	}

	return nil
}

// GetAuditList 查询审核数据列表
func (ReviewService) GetAuditList(req auditRequest.GetAuditListRequest) ([]entity.AuditAccessRecord, int64, error) {
	var audits []entity.AuditAccessRecord
	var total int64

	query := global.DB.Model(&entity.AuditAccessRecord{})

	// 按业务类型过滤
	if req.BizType != "" {
		query = query.Where("biz_type = ?", req.BizType)
	}

	// 按状态过滤
	if req.Status != nil {
		query = query.Where("status = ?", req.Status)
	}

	// 计算总数
	if err := query.Count(&total).Error; err != nil {
		global.Logger.Error("计算审核记录总数失败:" + err.Error())
		return nil, 0, errors.New("计算审核记录总数失败")
	}

	// 分页查询
	offset := (req.Page - 1) * req.Size
	if err := query.Offset(offset).Limit(req.Size).Order("created_at DESC").Find(&audits).Error; err != nil {
		global.Logger.Error("查询审核记录失败:" + err.Error())
		return nil, 0, errors.New("查询审核记录失败")
	}

	return audits, total, nil
}

// GetAuditDetail 查询审核详情
func (ReviewService) GetAuditDetail(req auditRequest.GetAuditDetailRequest) (*entity.AuditAccessRecord, error) {
	var audit entity.AuditAccessRecord
	if err := global.DB.First(&audit, req.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("审核记录不存在")
		}
		return nil, err
	}

	return &audit, nil
}
