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

type EntityRouter struct{}

func (EntityRouter) InitEntityRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/entity", moduleName))
	routerGroup.GET("/getCrmEntities", getCrmEntities)
}

// @Tags CrmEntityController
// @ID getCrmEntities
// @Router /crm/entity/getCrmEntities [post]
// @Summary 查看客户实体表信息（非字段信息）
// @Produce json
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Param EntityName query string false "实体名称" in:query
// @Success 200 {object} response.ApiResult[response.PageResult[crmResponse.CrmEntityVo]]
func getCrmEntities(c *gin.Context) {
	var req request.GetEntityListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	// todo: 获取实体信息
	result, err := entityService.GetCrmEntityList(req)
	if err != nil {
		global.Logger.Error("获取客户实体表信息失败", zap.Error(err))
		response.Fail(http.StatusInternalServerError, fmt.Sprintf("获取客户实体表信息失败:%v", err), c)
		return
	}
	response.Data[response.PageResult[crmResponse.CrmEntityVo]](*result, c)
}
