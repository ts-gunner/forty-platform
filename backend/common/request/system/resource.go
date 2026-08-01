package system

import "mime/multipart"

type UploadResourceRequest struct {
	File         *multipart.FileHeader `form:"file" binding:"required"`
	ResourceType int                   `form:"resourceType" binding:"required"` // 资源类型， 1-用户头像，2-CRM
}

type DeleteResourceRequest struct {
	ResourceId int64 `json:"resourceId,string" binding:"required"`
}
