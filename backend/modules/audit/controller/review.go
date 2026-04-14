package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	auditRequest "github.com/ts-gunner/forty-platform/common/request/audit"
	"github.com/ts-gunner/forty-platform/common/response"
	auditResponse "github.com/ts-gunner/forty-platform/common/response/audit"
	"go.uber.org/zap"
	"net/http"
)

/*
*
创建审核记录应该在其他模块中
*/
type ReviewRouter struct{}

func (ReviewRouter) InitReviewRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/review", moduleName))
	routerGroup.POST("/updateAudit", updateAudit)
	routerGroup.GET("/getAuditList", getAuditList)
}

// @Tags AuditController
// @ID updateAudit
// @Router /audit/review/updateAudit [post]
// @Summary 审核或驳回
// @Accept json
// @Produce json
// @Param request body auditRequest.UpdateAuditRequest true "审核或驳回"
// @Success 200 {object} response.ApiResult[any]
func updateAudit(c *gin.Context) {
	var req auditRequest.UpdateAuditRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常："+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	if err := reviewService.UpdateAudit(c.Request.Context(), req); err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Ok(c)
}

// @Tags AuditController
// @ID getAuditList
// @Router /audit/review/getAuditList [get]
// @Summary 查询审核记录列表
// @Produce json
// @Param bizType query string false "业务类型"
// @Param status query int false "状态"
// @Param pageNum query int false "页码" in:query
// @Param pageSize query int false "每页数量" in:query
// @Success 200 {object} response.ApiResult[response.PageResult[auditResponse.AuditAccessRecordVo]]
func getAuditList(c *gin.Context) {
	var req auditRequest.GetAuditListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常："+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	vo, err := reviewService.GetAuditList(req)
	if err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Data[response.PageResult[auditResponse.AuditAccessRecordVo]](*vo, c)
}
