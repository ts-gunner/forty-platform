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
	routerGroup.POST("/list", getEntityValueList)
	routerGroup.POST("/listBySelf", getEntityValueListBySelf)
	routerGroup.POST("/listByAdmin", getEntityValueListByAdmin)
	routerGroup.GET("/detail", getEntityValueDetail)
	routerGroup.POST("/insert", insertEntityValue)
	routerGroup.POST("/update", updateEntityValue)
	routerGroup.POST("/delete", deleteEntityValue)
	routerGroup.POST("/uploadCrmExcel", uploadCrmExcel)

}

// @Tags CrmEntityValueController
// @ID getEntityValueListBySelf
// @Router /crm/value/listBySelf [post]
// @Summary 客户端 - 获取自己创建的客户信息
// @Accept json
// @Produce json
// @Param request body request.GetCrmEntityValueListRequest true "查询实体数据参数"
// @Success 200 {object} response.ApiResult[crmResponse.CrmEntityValueObjectVo]
func getEntityValueListBySelf(c *gin.Context) {
	var req request.GetCrmEntityValueListRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := entityValueService.GetEntityValuePageListBySelf(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("获取客户实体表数据失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("获取客户实体表数据失败: %v", err), c)
		return
	}
	response.Data[crmResponse.CrmEntityValueObjectVo](*result, c)
}

// @Tags CrmEntityValueController
// @ID getEntityValueList
// @Router /crm/value/list [post]
// @Summary 客户端 - 获取对应的实体表数据
// @Accept json
// @Produce json
// @Param request body request.GetCrmEntityValueListRequest true "查询实体数据参数"
// @Success 200 {object} response.ApiResult[crmResponse.CrmEntityValueObjectVo]
func getEntityValueList(c *gin.Context) {
	var req request.GetCrmEntityValueListRequest
	if err := c.ShouldBindJSON(&req); err != nil {
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
// @ID getEntityValueListByAdmin
// @Router /crm/value/listByAdmin [post]
// @Summary 运营端 - 获取对应的实体表数据
// @Accept json
// @Produce json
// @Param request body request.AdminGetCrmEntityValueListRequest true "查询实体数据参数"
// @Success 200 {object} response.ApiResult[crmResponse.CrmEntityValueObjectVo]
func getEntityValueListByAdmin(c *gin.Context) {
	var req request.AdminGetCrmEntityValueListRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := entityValueService.AdminGetEntityValuePageList(req)
	if err != nil {
		global.Logger.Error("获取客户实体表数据失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("获取客户实体表数据失败: %v", err), c)
		return
	}

	response.Data[crmResponse.CrmEntityValueObjectVo](*result, c)
}

// @Tags CrmEntityValueController
// @ID getEntityValueDetail
// @Router /crm/value/detail [get]
// @Summary 获取对应的实体数据明细
// @Produce json
// @Param entityValueId query string true "实体数据id" in:query
// @Success 200 {object} response.ApiResult[crmResponse.CrmEntityValueVo]
func getEntityValueDetail(c *gin.Context) {
	var req request.GetCrmEntityValueDetailRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	result, err := entityValueService.GetEntityValueDetail(req.EntityValueId)
	if err != nil {
		global.Logger.Error("获取客户数据明细失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("获取客户数据明细失败: %v", err), c)
		return
	}
	response.Data[crmResponse.CrmEntityValueVo](*result, c)
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

// @Tags CrmEntityValueController
// @ID updateEntityValue
// @Router /crm/value/update [post]
// @Summary 更新实体数据
// @Accept json
// @Produce json
// @Param request body request.UpdateCrmEntityValueRequest true "更新实体数据参数"
// @Success 200 {object} response.ApiResult[any]
func updateEntityValue(c *gin.Context) {
	var req request.UpdateCrmEntityValueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	err := entityValueService.UpdateEntityValueData(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("更新客户实体表数据失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("更新客户实体表数据失败: %v", err), c)
		return
	}

	response.Ok(c)
}

// @Tags CrmEntityValueController
// @ID deleteEntityValue
// @Router /crm/value/delete [post]
// @Summary 删除实体数据
// @Accept json
// @Produce json
// @Param request body request.DeleteCrmEntityValueRequest true "删除实体数据参数"
// @Success 200 {object} response.ApiResult[any]
func deleteEntityValue(c *gin.Context) {
	var req request.DeleteCrmEntityValueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}

	err := entityValueService.DeleteEntityValueData(c.Request.Context(), req.Id)
	if err != nil {
		global.Logger.Error("删除客户实体表数据失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("删除客户实体表数据失败: %v", err), c)
		return
	}

	response.Ok(c)
}

// @Tags CrmEntityValueController
// @ID uploadCrmExcel
// @Router /crm/value/uploadCrmExcel [post]
// @Summary 上传表格，添加客户数据
// @Accept mpfd
// @Produce json
// @Param file formData file false "上传的表格数据"
// @Param entityId formData string false "实体表id"
// @Success 200 {object} response.ApiResult[any]
func uploadCrmExcel(c *gin.Context) {
	var req request.UploadCrmValueRequest
	if err := c.ShouldBind(&req); err != nil {
		global.Logger.Error("参数校验异常:"+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	err := entityValueService.HandleUploadExcel(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("上传实体表数据失败", zap.Error(err))
		response.Fail(http.StatusBadRequest, fmt.Sprintf("上传实体表数据失败: %v", err), c)
		return
	}
	response.Ok(c)
}
