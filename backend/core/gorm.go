package core

import (
	"errors"
	"fmt"
	"github.com/ts-gunner/forty-platform/common/global"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitGorm() (*gorm.DB, error) {
	switch global.Config.Servlet.DbType {
	case "mysql":
		return GormMysql(), nil
	}
	return nil, errors.New(fmt.Sprintf("暂不支持%s的数据库", global.Config.Servlet.DbType))
}

func GormMysql() *gorm.DB {
	if global.Config.Mysql.DbName == "" {
		return nil
	}

	mysqlConfig := mysql.Config{
		DSN:                       global.Config.Mysql.Dsn(),
		DefaultStringSize:         255,
		SkipInitializeWithVersion: false,
	}
	if db, err := gorm.Open(mysql.New(mysqlConfig), &gorm.Config{}); err != nil {
		panic(errors.New(fmt.Sprintf("数据库连接异常: %s", err)))
	} else {
		sqlDB, _ := db.DB()
		sqlDB.SetMaxIdleConns(global.Config.Mysql.MaxIdleConns)
		sqlDB.SetMaxOpenConns(global.Config.Mysql.MaxOpenConns)
		return db
	}
}
