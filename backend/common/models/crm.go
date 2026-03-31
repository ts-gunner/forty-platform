package models

type FindCrmValueParams struct {
	FilterParams map[string]any
	PageNum      int
	PageSize     int
	UserId       int64
}
