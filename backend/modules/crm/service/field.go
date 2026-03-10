package service

import (
	"context"
	"errors"

	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	response "github.com/ts-gunner/forty-platform/common/response/crm"
	"gorm.io/gorm"
)

type EntityFieldService struct{}

func (EntityFieldService) GetFieldById(fieldId int64) (*entity.CrmCustomerFields, error) {
	var field entity.CrmCustomerFields
	if err := global.DB.Where(map[string]any{
		"id":        fieldId,
		"is_delete": 0,
	}).First(&field).Error; err != nil {
		return nil, err
	}
	return &field, nil
}

func (EntityFieldService) GetFieldsByEntityId(entityId int64) ([]response.CrmEntityFieldVo, error) {
	_, err := entityModel.GetEntityById(entityId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("实体不存在")
		}
		return nil, err
	}

	var entityFields []entity.CrmCustomerFields
	if err := global.DB.Where("entity_id = ? and is_delete = 0", entityId).Order("sort_order ASC").Find(&entityFields).Error; err != nil {
		return nil, err
	}

	var result []response.CrmEntityFieldVo
	if err := copier.Copy(&result, entityFields); err != nil {
		return nil, errors.New("该实体复制出现异常: " + err.Error())
	}
	return result, nil
}

/*
*
1. 原更新逻辑：
先把entity_id相关所有的字段都物理删除， 再添加所有字段

该方案的风险点：
1. 数据孤岛风险，当field_key改了名字后，JSON数据的字段没有改变，下次无法通过映射，把旧的key映射出来
2. 物理删除，会引起id迅速增长，导致所有与其他表关联直接失效。
3. 并发冲突：当A进行删除逻辑时，B查询时，会没有任何字段。

2. 差分更新 (Upsert / Soft Update)

逻辑流程：
查询当前数据库中该 entity_id 已有的字段。
对比前端传过来的字段列表：
新增：数据库没有，前端有 -> 执行 INSERT。
更新：数据库有，前端也有 -> 执行 UPDATE（保持 id 不变）。
删除：数据库有，前端没有 -> 执行 is_delete = 1（逻辑删除）。

field_key是用来查询客户数据时跟customer_values表的json数据做映射，因此一旦设置，就不允许修改。
*/
func (EntityFieldService) UpsertEntityField(ctx context.Context, req request.UpsertCrmEntityFieldRequest) error {
	_, err := entityModel.GetEntityById(req.EntityId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("实体不存在")
		}
		return err
	}
	
	//var existField entity.CrmCustomerFields
	//if err := global.DB.Where("entity_id = ? AND field_key = ? AND is_delete = 0", req.EntityId, req.FieldKey).First(&existField).Error; err == nil {
	//	return errors.New("字段标识已存在")
	//}
	//
	//fieldObject := &entity.CrmCustomerFields{
	//	EntityId:    req.EntityId,
	//	FieldKey:    req.FieldKey,
	//	DisplayName: req.FieldName,
	//	DataType:    req.DataType,
	//	IsRequired:  req.IsRequired,
	//	SortOrder:   req.SortOrder,
	//	BaseRecordField: entity.BaseRecordField{
	//		CreatorId: utils.GetLoginUserId(ctx),
	//	},
	//}
	//return global.DB.Create(fieldObject).Error
	return nil
}
