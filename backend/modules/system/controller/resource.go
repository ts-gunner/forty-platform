package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response"
	"go.uber.org/zap"
	"net/http"
)

type SystemResourceRouter struct{}

func (PermissionRouter) InitResourceRouter(moduleName string, router *gin.RouterGroup) {
	routerGroup := router.Group(fmt.Sprintf("/%s/resource", moduleName))
	routerGroup.POST("/upload", uploadResource)
}

// @Tags SystemResourceController
// @ID uploadResource
// @Router /system/resource/upload [post]
// @Summary 上传资源文件
// @Accept mpfd
// @Produce json
// @Param file formData file true "待上传的文件"
// @Param resourceType formData int true "资源类型"
// @Success 200 {object} response.ApiResult[any]
func uploadResource(c *gin.Context) {
	var req request.UploadResourceRequest
	if err := c.ShouldBind(&req); err != nil {
		global.Logger.Error("参数校验异常: "+err.Error(), zap.Any("request", req))
		response.Fail(http.StatusBadRequest, "参数校验异常", c)
		return
	}
	if err := c.SaveUploadedFile(req.File, "D://data/"+req.File.Filename); err != nil {
		response.Fail(http.StatusBadRequest, "保存失败", c)
		return
	}
	response.Ok(c)
}
