package global

import (
	"github.com/casbin/casbin/v3"
	"github.com/go-redis/redis/v8"
	"github.com/sony/sonyflake/v2"
	"github.com/spf13/viper"
	"github.com/ts-gunner/forty-platform/config"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	Config    *config.AppConfig
	Viper     *viper.Viper
	DB        *gorm.DB
	Logger    *zap.Logger
	Redis     *redis.Client
	IdCreator *sonyflake.Sonyflake
	Enforcer  *casbin.Enforcer
)
