package system

type SysResourceVo struct {
	ResourceId   int64  `json:"resourceId,string"` // 资源ID
	ResourceType int    `json:"resourceType"`      // 资源类型
	UserId       int64  `json:"userId,string"`
	StorageType  string `json:"storageType"`
	RelPath      string `json:"relPath"`
	PreviewUrl   string `json:"previewUrl"`
	ResourceName string `json:"resourceName"`
	MimeType     string `json:"mimeType"`
	Suffix       string `json:"suffix"`
	Size         int64  `json:"size"`
}
