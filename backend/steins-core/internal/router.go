package internal

import "github.com/gin-gonic/gin"

func initRouter() *gin.Engine {

	r := gin.New()
	r.Use(gin.Recovery())
	// 注册模块路由

	return r
}
