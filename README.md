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



## 待优化项

[x] 前后端需要根据dataType给不同的输入框以及校验 
[x] 用户管理模块添加功能，可查看用户的角色列表
[x] 用户管理模块添加功能，微信小程序第一次登录创建账号时，默认绑定1001微信小程序用户的角色
[x] 修复小程序路径别名问题
[x] 实现request函数
[x] 小程序接上后端服务
[x] 省市区接入开源数据
[x] Taro适配umijs的openapi生成代码中的上传文件
[x] 实现上传头像与修改昵称功能
[x] 实现资源存储功能-【聚合图床】上传和获取访问链接
[ ] 实现资源存储功能，(本地，聚合图床，阿里云)可支持动态选择存储方式存储



## Q&A

### 前端项目安装依赖慢

主要原因: electron下载异常缓慢

windows解决方案:  预装electron和electron-builder

1. 下载压缩包: `https://www.steinstech.cn/resources/electron_install.zip`
2. 将压缩包中的electron和electorn-builder文件夹放在`~\AppData\Local`文件夹下


### 上传文件适配umijs的openapi插件

file类型需要转成`{uri: "微信的临时地址"} as any`, 参考`user_profile`的上传头像和昵称