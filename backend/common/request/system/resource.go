package system

import "mime/multipart"

type UploadResourceRequest struct {
	File         *multipart.FileHeader `form:"file" binding:"required"`
	ResourceType int                   `form:"resourceType" binding:"required"`
}
