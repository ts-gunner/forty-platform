# 多端跨平台


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



### frontend-admin 运营端前端项目


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

### backend 管理端-后端

无

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
