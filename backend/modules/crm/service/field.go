package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/samber/lo"
	"github.com/ts-gunner/forty-platform/common/enums"
	"github.com/ts-gunner/forty-platform/common/utils"
	"gorm.io/datatypes"
	"strings"
	"time"

	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	response "github.com/ts-gunner/forty-platform/common/response/crm"
	"gorm.io/gorm"
)

type EntityFieldService struct{}

func (EntityFieldService) GetFieldsByEntityId(entityId int64) ([]response.CrmEntityFieldVo, error) {
	e, err := entityMapper.GetEntityById(entityId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("实体不存在")
		}
		return nil, err
	}

	return convertFieldVos(e.Id, 0)
}

func (EntityFieldService) GetFieldsByEntityKey(entityKey string) ([]response.CrmEntityFieldVo, error) {
	e, err := entityMapper.GetEntityByKey(entityKey)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("实体不存在")
		}
		return nil, err
	}
	return convertFieldVos(e.Id, 0)
}

func (EntityFieldService) GetDeletedFieldsByEntityId(entityId int64) ([]response.CrmEntityFieldVo, error) {
	_, err := entityMapper.GetEntityById(entityId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("实体不存在")
		}
		return nil, err
	}
	return convertFieldVos(entityId, 1)
}

func convertFieldVos(entityId int64, isDelete int) ([]response.CrmEntityFieldVo, error) {
	var entityFields []*entity.CrmCustomerFields
	if err := global.DB.Where("entity_id = ? and is_delete = ?", entityId, isDelete).Order("sort_order ASC").Find(&entityFields).Error; err != nil {
		return nil, err
	}

	result := lo.Map(entityFields, func(it *entity.CrmCustomerFields, idx int) response.CrmEntityFieldVo {
		var opt = make([]string, 0)
		if it.Options != nil {
			_ = json.Unmarshal(*it.Options, &opt)
		}

		var vo response.CrmEntityFieldVo
		_ = copier.Copy(&vo, it)
		vo.Options = strings.Join(opt, ",")
		return vo
	})

	return result, nil
}

func (EntityFieldService) RestoreField(ctx context.Context, fieldId int64) error {
	userId := utils.GetLoginUserId(ctx)

	// 检查字段是否存在且已删除
	var field entity.CrmCustomerFields
	if err := global.DB.Where("id = ? and is_delete = 1", fieldId).First(&field).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("字段不存在或未被删除")
		}
		return err
	}

	// 检查是否有相同 fieldKey 的字段已存在
	var existingField entity.CrmCustomerFields
	if err := global.DB.Where("entity_id = ? and field_key = ? and is_delete = 0", field.EntityId, field.FieldKey).First(&existingField).Error; err == nil {
		return errors.New("相同字段Key的字段已存在，无法恢复")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// 恢复字段
	if err := global.DB.Model(&field).Updates(map[string]interface{}{
		"is_delete":   0,
		"updater_id":  userId,
		"delete_time": nil,
		"deleter_id":  nil,
	}).Error; err != nil {
		return err
	}

	return nil
}

/*
*
差分更新 (Upsert / Soft Update)

逻辑流程：
查询当前数据库中该 entity_id 已有的字段。
对比前端传过来的字段列表：
新增：数据库没有，前端有 -> 执行 INSERT。
更新：数据库有，前端也有 -> 执行 UPDATE（保持 id 不变）。
删除：数据库有，前端没有 -> 执行 is_delete = 1（逻辑删除）。

请求的字段可能有以下情况:
 1. 数据库中存在，但修改了key  --> 直接抛异常，不给修改key
 2. 数据库存在，删除该记录  --> 添加到删除队列中
 3. 数据库存在，更新了非key和非dataType字段  --> 添加到更新队列中
 4. 数据库不存在，新增一条字段信息 --> 添加到插入队列中
 5. 数据库存在，新增相同key的字段信息 --> 直接抛异常，不给新增
 6. 数据库存在, 更新了dataType字段 --> 直接抛异常，不给修改dataType, 避免数据错乱

7. 数据库已删除，但又插入相同key --> 不允许插入数据， 让用户在垃圾箱中找回

field_key是用来查询客户数据时跟customer_values表的json数据做映射，因此一旦设置，就不允许修改。
*/
func (EntityFieldService) UpsertEntityField(ctx context.Context, req request.UpsertCrmEntityFieldRequest) error {
	_, err := entityMapper.GetEntityById(req.EntityId)
	userId := utils.GetLoginUserId(ctx)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("实体不存在")
		}
		return err
	}
	return global.DB.Transaction(func(tx *gorm.DB) error {
		// 找出所有跟entityId相关的字段(包含逻辑删除)
		entityFields := entityFieldMapper.GetEntityFieldsByEntityIdWithDeleted(tx, req.EntityId)
		existsFieldKeys := lo.Map(entityFields, func(it entity.CrmCustomerFields, index int) string {
			return it.FieldKey
		})
		var handledFieldIds []int64
		var insertFields []entity.CrmCustomerFields

		for _, curField := range req.Fields {
			// 新增部分
			if curField.Id == nil {
				// 处理情况5, 7
				if lo.Contains(existsFieldKeys, curField.FieldKey) {
					return errors.New(fmt.Sprintf("字段Key-[%s]已存在，不可重复添加或在回收站中找回", curField.FieldKey))
				}

				// 处理情况4
				var options datatypes.JSON
				// 如果datatype是4时，需要特殊处理, A,B,C -> ['A', 'B', 'C']
				if enums.CrmFieldDataType(curField.DataType) == enums.CrmDataTypePicker {
					optionArr := lo.Map(strings.Split(curField.Options, ","), func(it string, idx int) string {
						return strings.TrimSpace(it)
					})
					optionArr = lo.Filter(optionArr, func(it string, idx int) bool {
						return it != ""
					})
					jsonBytes, _ := json.Marshal(optionArr)
					options = datatypes.JSON(jsonBytes)

				}
				newId, _ := global.IdCreator.NextID()
				insertField := entity.CrmCustomerFields{
					Id:         newId,
					EntityId:   req.EntityId,
					FieldKey:   curField.FieldKey,
					FieldName:  curField.FieldName,
					DataType:   curField.DataType,
					Options:    &options,
					IsRequired: curField.IsRequired,
					SortOrder:  curField.SortOrder,
					BaseRecordField: entity.BaseRecordField{
						CreatorId: userId,
					},
				}
				insertFields = append(insertFields, insertField)
				continue
			}

			// 更新部分
			if curField.Id != nil {
				preField, ok := lo.Find(entityFields, func(item entity.CrmCustomerFields) bool {
					return item.Id == *curField.Id
				})
				if !ok {
					return errors.New(fmt.Sprintf("找不到对应[%s]的字段信息", curField.Id))
				}
				// 处理情况1
				if preField.FieldKey != curField.FieldKey {
					return errors.New(fmt.Sprintf("字段key不允许改变， 发生了改变: [%s] -> [%s]", preField.FieldKey, curField.FieldKey))
				}

				// 处理情况6
				if preField.DataType != curField.DataType {
					return errors.New(fmt.Sprintf("字段 [%s] 的数据类型不允许修改。如需更改，请删除原字段并新增。", curField.FieldName))
				}
				var options datatypes.JSON
				// 如果datatype是4时，需要特殊处理, A,B,C -> ['A', 'B', 'C']
				if enums.CrmFieldDataType(curField.DataType) == enums.CrmDataTypePicker {
					optionArr := lo.Map(strings.Split(curField.Options, ","), func(it string, idx int) string {
						return strings.TrimSpace(it)
					})
					optionArr = lo.Filter(optionArr, func(it string, idx int) bool {
						return it != ""
					})
					jsonBytes, _ := json.Marshal(optionArr)
					options = datatypes.JSON(jsonBytes)

				}
				// 处理情况3
				if err = tx.Model(preField).Updates(map[string]any{
					"field_name":  curField.FieldName,
					"data_type":   curField.DataType,
					"is_required": curField.IsRequired,
					"sort_order":  curField.SortOrder,
					"options":     options,
					"updater_id":  userId,
				}).Error; err != nil {
					global.Logger.Error("处理更新失败:" + err.Error())
					return errors.New("处理更新失败")
				}
				handledFieldIds = append(handledFieldIds, preField.Id)
				continue
			}

		}
		// 处理情况2, 必须优先删除，再插入，否则会把插入的删除
		deleteEntities := lo.Filter(entityFields, func(it entity.CrmCustomerFields, idx int) bool {
			return !lo.Contains(handledFieldIds, it.Id)
		})
		deleteEntityIds := lo.Map(deleteEntities, func(it entity.CrmCustomerFields, index int) int64 {
			return it.Id
		})
		if len(deleteEntityIds) > 0 {
			if err = tx.Model(&entity.CrmCustomerFields{}).Where("id IN ?", deleteEntityIds).Updates(map[string]interface{}{
				"is_delete":   1,
				"delete_time": time.Now().Local(),
				"deleter_id":  userId,
			}).Error; err != nil {
				global.Logger.Error("处理删除失败:" + err.Error())
				return errors.New("处理删除失败")
			}
		}

		// 插入
		if err = tx.CreateInBatches(insertFields, len(insertFields)).Error; err != nil {
			global.Logger.Error("处理插入失败:" + err.Error())
			return errors.New("处理插入失败")
		}
		// 删除部分

		return nil
	})

}
