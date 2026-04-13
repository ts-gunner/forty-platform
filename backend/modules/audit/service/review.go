package service

import (
	"context"
	"errors"
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	auditRequest "github.com/ts-gunner/forty-platform/common/request/audit"
	"github.com/ts-gunner/forty-platform/common/response"
	auditResponse "github.com/ts-gunner/forty-platform/common/response/audit"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/gorm"
)

type ReviewService struct{}

// UpdateAudit 审核或驳回
func (ReviewService) UpdateAudit(ctx context.Context, req auditRequest.UpdateAuditRequest) error {
	userId := utils.GetLoginUserId(ctx)
	return global.DB.Transaction(func(tx *gorm.DB) error {
		// 检查审核记录是否存在
		var audit entity.AuditAccessRecord
		if err := tx.First(&audit, req.ID).Error; err != nil {
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
		if err := tx.Model(&audit).Updates(map[string]interface{}{
			"status":     req.Status,
			"remark":     req.Remark,
			"updater_id": userId,
		}).Error; err != nil {
			global.Logger.Error("更新审核记录失败:" + err.Error())
			return errors.New("更新审核记录失败")
		}
		// 审核成功， 添加任务队列
		if req.Status == 1 {
			global.Redis.RPush(ctx, audit.BizType, audit.BizId)

		}
		return nil

	})

}

// GetAuditList 查询审核数据列表
func (ReviewService) GetAuditList(req auditRequest.GetAuditListRequest) (*response.PageResult[auditResponse.AuditAccessRecordVo], error) {
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
		return nil, err
	}
	pageNum := utils.GetCurrentPage(req.PageNum)
	pageSize := utils.GetPageSize(req.PageSize)
	// 分页查询
	offset := (pageNum - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Order("create_time DESC").Find(&audits).Error; err != nil && err != gorm.ErrRecordNotFound {
		global.Logger.Error("查询审核记录失败:" + err.Error())
		return nil, errors.New("查询审核记录失败")
	}
	vos := make([]auditResponse.AuditAccessRecordVo, 0)
	if err := copier.Copy(&vos, &audits); err != nil {
		return nil, err
	}
	return &response.PageResult[auditResponse.AuditAccessRecordVo]{
		List:     vos,
		Total:    total,
		PageNum:  pageNum,
		PageSize: pageSize,
	}, nil
}
