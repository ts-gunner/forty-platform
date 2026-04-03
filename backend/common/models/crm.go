package models

type FindCrmValueParams struct {
	FilterParams map[string]any
	PageNum      int
	PageSize     int
	UserId       int64
}

type LocationData struct {
	Latitude  float32 `json:"latitude"`  // 纬度
	Longitude float32 `json:"longitude"` // 经度
	Address   string  `json:"address"`   // 地址说明
}
