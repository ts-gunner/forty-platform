package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ts-gunner/forty-platform/common/global"
)

func RequestLog() gin.HandlerFunc {

	return func(c *gin.Context) {
		global.Logger.Info(fmt.Sprintf("call api --> %s", c.Request.URL.Path))
		c.Next()
	}
}
