package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"go.uber.org/zap"
)

type EntityValueRouter struct{}

func (EntityRouter) InitEntityValueRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/value", moduleName))
	routerGroup.GET("/list", getEntityValueList)
	routerGroup.POST("/insert", insertEntityValue)

}

// @Tags CrmEntityValueController
// @ID getEntityValueList
// @Router /crm/value/list [get]
// @Summary 获取对应的实体表数据
// @Produce json
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Param entityId query string false "实体表id" in:query
// @Success 200 {object} response.ApiResult[crmResponse.CrmEntityValueObjectVo]
func getEntityValueList(c *gin.Context) {
	var req request.GetCrmEntityValueListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := entityValueService.GetEntityValuePageList(req)
	if err != nil {
		global.Logger.Error("获取客户实体表数据失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("获取客户实体表数据失败: %v", err), c)
		return
	}

	response.Data[crmResponse.CrmEntityValueObjectVo](*result, c)
}

// @Tags CrmEntityValueController
// @ID insertEntityValue
// @Router /crm/value/insert [post]
// @Summary 插入实体数据
// @Accept json
// @Produce json
// @Param request body request.InsertCrmEntityValueRequest true "写入实体数据参数"
// @Success 200 {object} response.ApiResult[any]
func insertEntityValue(c *gin.Context) {
	var req request.InsertCrmEntityValueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	err := entityValueService.InsertEntityValueData(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("写入客户实体表数据失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("写入客户实体表数据失败: %v", err), c)
		return
	}

	response.Ok(c)
}
