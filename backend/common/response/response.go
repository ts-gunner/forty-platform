package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

const (
	DEFAULT_MSG = "成功"
)

type ApiResult[T any] struct {
	Code int    `json:"code" example:"200"`
	Msg  string `json:"msg" example:"成功"`
	Data T      `json:"data"`
}

func Result[T any](code int, msg string, data T, c *gin.Context) {
	c.JSON(http.StatusOK, ApiResult[T]{code, msg, data})
}

func Ok(c *gin.Context) {
	Result[any](http.StatusOK, DEFAULT_MSG, nil, c)
}

func Data[T any](data T, c *gin.Context) {
	Result[any](http.StatusOK, DEFAULT_MSG, data, c)
}

func Fail(code int, msg string, c *gin.Context) {
	Result[any](code, msg, nil, c)
}

type PageResult[T any] struct {
	List     []T   `json:"list"`
	Total    int64 `json:"total"`
	PageNum  int   `json:"pageNum"`
	PageSize int   `json:"pageSize"`
}
