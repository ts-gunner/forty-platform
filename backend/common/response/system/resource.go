package system

type StorageVo struct {
	RelativePath string // 相对路径
	DirectUrl    string // 直接访问的url

}

type SysResourceVo struct {
	ResourceId   int64 `json:"resourceId,string"` // 资源ID
	ResourceType int   `json:"resourceType"`      // 资源类型

}
