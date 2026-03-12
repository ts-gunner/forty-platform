package service

import (
	"errors"

	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
)

type EntityValueService struct {
}

func (EntityValueService) GetEntityValuePageList(req request.GetCrmEntityValueListRequest) (*crmResponse.CrmEntityValueObjectVo, error) {
	entityObject, err := entityModel.GetEntityById(req.EntityId)
	if err != nil {
		return nil, err
	}
	if entityObject == nil {
		return nil, errors.New("该实体不存在")
	}
	var entityValues []entity.CrmCustomerValues
	var total int64
	db := global.DB.Model(&entity.CrmCustomerValues{}).Where("entity_id = ? and is_delete = 0", req.EntityId)
	if err := db.Count(&total).Error; err != nil {
		return nil, errors.New("该实体没有任何数据!")
	}
	if req.PageNum <= 0 {
		req.PageNum = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}
	offset := (req.PageNum - 1) * req.PageSize
	if err := db.Order("create_time DESC").Offset(offset).Limit(req.PageSize).Find(&entityValues).Error; err != nil {
		return nil, err
	}

	list := make([]crmResponse.CrmEntityValueVo, 0, len(entityValues))
	for _, e := range entityValues {
		list = append(list, crmResponse.CrmEntityValueVo{
			Id:           e.Id,
			CustomerName: e.CustomerName,
			Remark:       e.Remark,
			Values:       e.Values.String(),
			CreateTime:   e.UpdateTime,
		})
	}

	fieldList, err := entityFieldModel.GetEntityFieldsByEntityId(global.DB, req.EntityId)
	if err != nil {
		return nil, err
	}
	var fieldVos []crmResponse.CrmEntityFieldVo
	if err = copier.Copy(&fieldVos, fieldList); err != nil {
		return nil, err
	}
	return &crmResponse.CrmEntityValueObjectVo{
		EntityId:  req.EntityId,
		FieldList: fieldVos,
		EntityValue: response.PageResult[crmResponse.CrmEntityValueVo]{
			List:     list,
			Total:    total,
			PageNum:  req.PageNum,
			PageSize: req.PageSize,
		},
	}, nil
}
