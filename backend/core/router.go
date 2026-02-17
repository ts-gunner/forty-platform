package core

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/ts-gunner/forty-platform/common/global"
	"github.com/ts-gunner/forty-platform/common/handler"
	_ "github.com/ts-gunner/forty-platform/docs"
	"github.com/ts-gunner/forty-platform/modules/system/controller"
	"net/http"
)

func initRouter() *gin.Engine {
	r := gin.Default()

	r.Use(gin.Recovery())
	swaggerGroup := r.Group(global.Config.Servlet.ContextPath)
	contextGroup := r.Group(
		global.Config.Servlet.ContextPath,
		handler.RequestLog(),
		handler.IdentityVerification(&handler.AuthorizationConfig{
			ExcludePaths: []string{
				"/auth/adminPwdLogin",
			},
		}),
	)
	initSwagger(swaggerGroup)
	controller.SystemRouter.InitSystemRouter(contextGroup)
	return r
}

func initSwagger(r *gin.RouterGroup) {
	// 注入swagger文档
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	// 整合knife4j + swagger
	r.GET("/v3/api-docs/swagger-config", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"configUrl":    global.Config.Servlet.ContextPath + "/v3/api-docs/swagger-config",
			"validatorUrl": "",
			"urls": []gin.H{
				{
					"url":  global.Config.Servlet.ContextPath + "/swagger/doc.json", // 指向生成的 swagger 资源
					"name": "默认分组",
				},
			},
		})
	})
	r.StaticFile("/doc.html", "./knife4j/doc.html")
	r.StaticFile("/api/doc/swagger.json", "./docs/swagger.json")
	r.StaticFS("/webjars", http.Dir("./knife4j/webjars"))
}
