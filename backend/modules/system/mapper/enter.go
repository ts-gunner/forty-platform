package mapper

var SystemMapper = new(SystemMapperGroup)

type SystemMapperGroup struct {
	RoleMapper
	SysUserMapper
	SysResourceMapper
}
