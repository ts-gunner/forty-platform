package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"go.uber.org/zap"
)

type SystemResourceRouter struct{}

func (SystemResourceRouter) InitResourceRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/resource", moduleName))
	routerGroup.POST("/upload", uploadResource)
	routerGroup.GET("/access/:resourceId", accessResource)
	routerGroup.DELETE("/delete", deleteResource)
}

// @Tags SystemResourceController
// @ID uploadResource
// @Router /system/resource/upload [post]
// @Summary 上传资源
// @Accept mpfd
// @Produce json
// @Param file formData file true "file"
// @Param resourceType formData int true "resource type"
// @Success 200 {object} response.ApiResult[systemResponse.SysResourceVo]
func uploadResource(c *gin.Context) {
	var req request.UploadResourceRequest
	if err := c.ShouldBind(&req); err != nil {
		global.Logger.Error("resource upload bind failed: "+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "parameter validation failed", c)
		return
	}

	vo, err := resourceService.UploadResource(c.Request.Context(), req)
	if err != nil {
		global.Logger.Error("upload resource failed", zap.Error(err))
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}
	response.Data[systemResponse.SysResourceVo](*vo, c)
}

// @Tags SystemResourceController
// @ID accessResource
// @Router /system/resource/access/{resourceId} [get]
// @Summary 重定向访问对象存储资源url
// @Produce plain
// @Param resourceId path string true "resource ID"
// @Success 302
func accessResource(c *gin.Context) {
	resourceId, err := strconv.ParseInt(c.Param("resourceId"), 10, 64)
	if err != nil || resourceId == 0 {
		response.Fail(http.StatusBadRequest, "resourceId invalid", c)
		return
	}

	accessUrl, err := resourceService.GetResourceAccessUrl(resourceId)
	if err != nil {
		global.Logger.Error("get resource access url failed", zap.Error(err))
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}

	c.Header("Cache-Control", "no-store")
	c.Redirect(http.StatusFound, accessUrl)
}

// @Tags SystemResourceController
// @ID deleteResource
// @Router /system/resource/delete [delete]
// @Summary 删除资源
// @Accept json
// @Produce json
// @Param request body request.DeleteResourceRequest true "delete resource params"
// @Success 200 {object} response.ApiResult[any]
func deleteResource(c *gin.Context) {
	var req request.DeleteResourceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		global.Logger.Error("resource delete bind failed: "+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "parameter validation failed", c)
		return
	}

	if err := resourceService.DeleteResource(c.Request.Context(), req.ResourceId); err != nil {
		global.Logger.Error("delete resource failed", zap.Error(err))
		response.Fail(http.StatusBadRequest, err.Error(), c)
		return
	}
	response.Ok(c)
}
