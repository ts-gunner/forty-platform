package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
	"go.uber.org/zap"
	"net/http"
)

type EntityFieldRouter struct{}

func (EntityRouter) InitEntityFieldRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/field", moduleName))
	routerGroup.GET("/getFieldsByEntityId", getFieldsByEntityId)
}

// @Tags CrmEntityFieldController
// @ID getFieldsByEntityId
// @Router /crm/field/getFieldsByEntityId [get]
// @Summary 根据实体表id获取实体表字段
// @Produce json
// @Param entityId query string false "实体表id" in:query
// @Success 200 {object} response.ApiResult[[]crmResponse.CrmEntityFieldVo]
func getFieldsByEntityId(c *gin.Context) {
	var req request.GetCrmEntityFieldRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常", zap.Any("request", req))
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
