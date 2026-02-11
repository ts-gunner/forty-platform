# 管理平台-Refactor


## 总览

产品端-前端

技术栈： react + umijs + redux + electron + intl + antd + tiptap


管理端-后端

admin 初定模块划分：
- core
- user(audit)
- aigc
- cms
- file
- common

## 快速开始

### steins-frontend-app 产品端前端项目

项目依赖安装
```shell
yarn
yarn install
yarn add antd
```

调试与构建
```shell
yarn
npm run dev
npm run build
```

### steins-frontend-admin 管理端前端项目


项目依赖安装
```shell
yarn
yarn install
```

调试与构建
```shell
yarn
npm run dev
npm run build
```

### steins-admin 管理端-后端

在core模块中运行AdminApplication，查看文档: `/steins/doc.html`


需要配置环境变量或VM参数，二选一
```shell
# 环境变量设置：
NACOS_SERVER_ADDR=192.168.3.112:8848;
NACOS_USERNAME=nacos;
NACOS_PASSWORD=nacos;
# 或者 设置VM参数：
-Dspring.cloud.nacos.server-addr=192.168.3.112:8848 -Dspring.cloud.nacos.username=nacos -Dspring.cloud.nacos.password=nacos
```

额外接入SkyWalking，则需要设置VM参数与环境变量（此处SW_AGENT_NAME需对应admin）：
```shell
#VM options 添加：
-javaagent:【你的项目路径】\steins-platform\resources\jar\skywalking-agent\skywalking-agent.jar
#Environment variables 添加：
SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.3.112:11800;SW_AGENT_NAME=dev_steins_admin
```

### steins-gateway 网关-后端

需要配置环境变量或VM参数，二选一
```shell
# 环境变量设置：
NACOS_SERVER_ADDR=192.168.3.112:8848;
NACOS_USERNAME=nacos;
NACOS_PASSWORD=nacos;
BASE_HOST=127.0.0.2
# 或者 设置VM参数：
-Dspring.cloud.nacos.server-addr=192.168.3.112:8848 -Dspring.cloud.nacos.username=nacos -Dspring.cloud.nacos.password=nacos
```

额外接入SkyWalking，则需要设置VM参数与环境变量（此处SW_AGENT_NAME需对应gateway）：
```shell
#VM options 添加：
-javaagent:【你的项目路径】\steins-platform\resources\jar\skywalking-agent\skywalking-agent.jar
#Environment variables 添加：
SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.3.112:11800;SW_AGENT_NAME=dev_steins_gateway
```


## 部署


### 通过docker-compose部署

1. 服务器上拉取代码
2. 进入到`resources/docker`文件夹
3. 将`.env_template`复制到`.env`,修改对应参数值
4. 运行指令: `make`
5. 单独部署中间件（可选）: `make middleware-up`
6. 单独部署服务（可选）： `make up`


### 离线部署

1. 进入到`resources/docker`文件夹
2. 将`.env_template`复制到`.env`,修改对应参数值
3. 运行指令: `make up`
4. 将所有镜像导出: `docker save <image_name>:<image_version> > <image_name>.tar`
5. 镜像导入: `docker load < <image_name>.tar`

## Q&A

### 前端项目安装依赖慢

主要原因: electron下载异常缓慢

windows解决方案:  预装electron和electron-builder

1. 下载压缩包: `https://www.steinstech.cn/resources/electron_install.zip`
2. 将压缩包中的electron和electorn-builder文件夹放在`~\AppData\Local`文件夹下
