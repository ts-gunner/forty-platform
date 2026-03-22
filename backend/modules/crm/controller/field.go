package controller

import (
	"fmt"
	"net/http"

	"github.com/samber/lo"
	"github.com/ts-gunner/forty-platform/common/constant"

	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"go.uber.org/zap"
)

type EntityFieldRouter struct{}

func (EntityFieldRouter) InitEntityFieldRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/field", moduleName))
	routerGroup.GET("/getFieldsByEntityId", getFieldsByEntityId)
	routerGroup.GET("/getFieldsByEntityKey", getFieldsByEntityKey)
	routerGroup.POST("/upsertEntityField", upsertEntityField)
	routerGroup.GET("/getDeletedFieldsByEntityId", getDeletedFieldsByEntityId)
	routerGroup.POST("/restoreField", restoreField)
}

// @Tags CrmEntityFieldController
// @ID getFieldsByEntityId
// @Router /crm/field/getFieldsByEntityId [get]
// @Summary 根据实体表id获取实体表字段
// @Produce json
// @Param entityId query string true "实体表id" in:query
// @Success 200 {object} response.ApiResult[[]crmResponse.CrmEntityFieldVo]
func getFieldsByEntityId(c *gin.Context) {
	var req request.GetCrmEntityFieldRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常: "+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	result, err := entityFieldService.GetFieldsByEntityId(req.EntityId)
	if err != nil {
		global.Logger.Error("获取实体表字段数据异常")
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}
	response.Data[[]crmResponse.CrmEntityFieldVo](result, c)
}

// @Tags CrmEntityFieldController
// @ID getFieldsByEntityKey
// @Router /crm/field/getFieldsByEntityKey [get]
// @Summary 根据实体表key获取实体表字段
// @Produce json
// @Param entityKey query string true "实体表key" in:query
// @Success 200 {object} response.ApiResult[[]crmResponse.CrmEntityFieldVo]
func getFieldsByEntityKey(c *gin.Context) {
	var req request.GetCrmEntityFieldByKeyRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常: "+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	result, err := entityFieldService.GetFieldsByEntityKey(req.EntityKey)
	if err != nil {
		global.Logger.Error("获取实体表字段数据异常")
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}
	response.Data[[]crmResponse.CrmEntityFieldVo](result, c)
}

// @Tags CrmEntityFieldController
// @ID upsertEntityField
// @Router /crm/field/upsertEntityField [post]
// @Summary 更新实体表所有字段
// @Accept json
// @Produce json
// @Param request body request.UpsertCrmEntityFieldRequest true "添加实体表字段"
// @Success 200 {object} response.ApiResult[any]
func upsertEntityField(c *gin.Context) {
	var req request.UpsertCrmEntityFieldRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常："+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	reqFieldKeys := lo.Map(req.Fields, func(it request.CrmEntityField, idx int) string {
		return it.FieldKey
	})
	if !lo.Contains(reqFieldKeys, constant.CRM_CUSTOMER_NAME) || !lo.Contains(reqFieldKeys, constant.CRM_CUSTOMER_REMARK) {
		response.Fail(http.StatusBadRequest, "缺少关键字段【customer_name】和【remark】", c)
		return
	}

	filterList := lo.Filter(req.Fields, func(it request.CrmEntityField, idx int) bool {
		if it.FieldKey == constant.CRM_CUSTOMER_NAME || it.FieldKey == constant.CRM_CUSTOMER_REMARK {
			return false
		}
		return it.SortOrder <= 0
	})
	if len(filterList) > 0 {
		response.Fail(http.StatusBadRequest, "非关键字段的排列顺序必须大于0", c)
		return
	}
	if err := entityFieldService.UpsertEntityField(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags CrmEntityFieldController
// @ID getDeletedFieldsByEntityId
// @Router /crm/field/getDeletedFieldsByEntityId [get]
// @Summary 获取已删除的实体表字段
// @Produce json
// @Param entityId query string false "实体表id" in:query
// @Success 200 {object} response.ApiResult[[]crmResponse.CrmEntityFieldVo]
func getDeletedFieldsByEntityId(c *gin.Context) {
	var req request.GetCrmEntityFieldRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常: "+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	result, err := entityFieldService.GetDeletedFieldsByEntityId(req.EntityId)
	if err != nil {
		global.Logger.Error("获取已删除实体表字段数据异常")
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}
	response.Data[[]crmResponse.CrmEntityFieldVo](result, c)
}

// @Tags CrmEntityFieldController
// @ID restoreField
// @Router /crm/field/restoreField [post]
// @Summary 恢复已删除的实体表字段
// @Accept json
// @Produce json
// @Param request body request.RestoreCrmEntityFieldRequest true "恢复实体表字段"
// @Success 200 {object} response.ApiResult[any]
func restoreField(c *gin.Context) {
	var req request.RestoreCrmEntityFieldRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常："+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	if err := entityFieldService.RestoreField(c.Request.Context(), req.FieldId); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}
