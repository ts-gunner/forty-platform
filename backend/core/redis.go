package core

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/ts-gunner/forty-platform/common/global"
)

func InitRedis() *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     global.Config.Redis.Addr(),
		Password: global.Config.Redis.Password,
		DB:       global.Config.Redis.DB,
	})
	ctx := context.TODO()
	status := client.Ping(ctx)
	if status.Err() != nil {
		panic(fmt.Errorf("redis连接失败: %v", status.Err()))
	}
	return client
}
