package service

import (
	"encoding/json"
	"errors"
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"go.uber.org/zap"
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

func (EntityValueService) InsertEntityValueData(req request.InsertCrmEntityValueRequest) error {
	entityObject, err := entityModel.GetEntityById(req.EntityId)
	if err != nil {
		return err
	}
	if entityObject == nil {
		return errors.New("该实体不存在")
	}

	// 找到他的字段
	//fieldList, err := entityFieldModel.GetEntityFieldsByEntityId(global.DB, req.EntityId)
	//if err != nil {
	//	return err
	//}

	for _, data := range req.Data {
		var dict map[string]interface{}
		if err := json.Unmarshal([]byte(data.Values), &dict); err != nil {
			return err
		}
		global.Logger.Info("dict数据:", zap.Any("dict", dict))
	}

	return nil
}
