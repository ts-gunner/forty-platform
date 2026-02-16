package config

import "fmt"

type Mysql struct {
	// 将CommonDB的配置扁平化拆解到Mysql中
	CommonDB `mapstructure:",squash" yaml:",inline"`
}

func (m *Mysql) Dsn() string {
	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		m.Username, m.Password, m.Path, m.Port, m.DbName,
	)
}
