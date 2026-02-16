# 后台服务

以go框架搭建的后端服务

# 目录结构

```text
backend
├─steins-aigc  // ai聊天模块
├─steins-cms   // 内容管理模块
├─steins-common  // 通用模块
├─steins-core  // 核心模块，web项目启动，日志管理等
├─steins-file  // 文件管理模块
└─steins-user  // 用户管理模块

```

# go依赖


|   package    |              origin               |   remark    |
|:------------:|:---------------------------------:|:-----------:|
|     gin      |     github.com/gin-gonic/gin      |  go web框架   |
|    viper     |      github.com/spf13/viper       | 读取配置文件，支持监听 |
|     zap      |          go.uber.org/zap          |    日志框架     |
|    cobra     |      github.com/spf13/cobra       |    cli工具    |
|     gorm     |           gorm.io/gorm            |   gorm框架    |
| mysql-driver |       gorm.io/driver/mysql        |   mysql驱动   |
|    copier    |     github.com/jinzhu/copier      |    对象复制     |
|     jwt      |   github.com/golang-jwt/jwt/v5    |     鉴权      |
|    casbin    |    github.com/casbin/casbin/v2    |    权限校验     |
| gorm-adapter | github.com/casbin/gorm-adapter/v3 |  权限校验的适配器   |
|  go-swagger  |   github.com/swaggo/gin-swagger   |    api文档    |
|    lancet    |  	github.com/duke-git/lancet/v2   |   go工具箱	    |
|    redis     |  	github.com/go-redis/redis/v8  |   redis	    |


# Q&A

## 无法使用makefile的指令

需要自行安装minGW
