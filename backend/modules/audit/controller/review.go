package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	auditRequest "github.com/ts-gunner/forty-platform/common/request/audit"
	"github.com/ts-gunner/forty-platform/common/response"
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
	routerGroup.GET("/getAuditDetail", getAuditDetail)
}

// @Tags AuditController
// @ID updateAudit
// @Router /audit/updateAudit [post]
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
// @Router /audit/getAuditList [get]
// @Summary 查询审核记录列表
// @Produce json
// @Param bizType query string false "业务类型"
// @Param status query string false "状态"
// @Param page query int false "页码，默认1"
// @Param size query int false "每页大小，默认10"
// @Success 200 {object} response.ApiResult[any]
func getAuditList(c *gin.Context) {
	var req auditRequest.GetAuditListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常："+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	audits, total, err := reviewService.GetAuditList(req)
	if err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Data(map[string]interface{}{
		"list":  audits,
		"total": total,
	}, c)
}

// @Tags AuditController
// @ID getAuditDetail
// @Router /audit/getAuditDetail [get]
// @Summary 查询审核记录详情
// @Produce json
// @Param id query string true "审核记录ID"
// @Success 200 {object} response.ApiResult[any]
func getAuditDetail(c *gin.Context) {
	var req auditRequest.GetAuditDetailRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常："+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	audit, err := reviewService.GetAuditDetail(req)
	if err != nil {
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	response.Data(audit, c)
}
