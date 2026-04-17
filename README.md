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

`docker network create platform-shared-net`
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
[x] 猎猫小程序接入CRM数据，暂时使用静态视图，未来规划在运营端实现动态视图
[x] 客户数据添加所属id
[x] CRM字段类型改成字符串
[x] 完善小程序的ValueBoxGenerator
[x] 整理猎猫的 crm sql数据
[x] 创建客户信息时，给字段添加必填的提示
[x] 客户信息的更新
[x] 筛选客户信息
[x] 搜索框查询客户信息
[x] 客户信息的收藏
[x] 查看收藏的客户信息
[x] 客户信息左滑弹出删除等操作，参考电商平台购物车设计
[x] 滑动底部加载更多数据
[x] 创建客户信息接入后端接口
[x] 所有客户信息，筛选业务员数据
[x] 查询全部客户信息的接口需要鉴权
[x] Docker部署脚本
[x] 运营端管理员可删除客户信息
[x] 向下滑动刷新数据(优化项)
[ ] 搜索时，选择备注，任意输入都会查出所有数据 BUG
[ ] 生产端，搜索时，备注的优先级比企业名称高
[ ] 用户首页，客户数据统计(优化项)
[ ] 滚动组件使用微信原生组件, 例如：scroll-view和swiper(优化项)
[ ] 客户信息字段支持文件上传(优化项)
[ ] 实现资源存储功能，(本地，聚合图床，阿里云)可支持动态选择存储方式存储(优化项)
[ ] 搜索框可以搜索客户名称等datatype为text的字段，暂未想到较好的设计(优化项)
[ ] 看到筛选信息。(优化项)


### 3-30 - 客户建议

[x] 详细地址改成定位，业务员到达客户现场后，可以通过定位快速填写位置
[x] 客户来源，Picker类型，选择其他时，用户可自定义
[x] 新的客户分类我今天更新一下
[x] 我的客户页面， 列表上每个卡片都加个收藏
[x] 导入现有的表格，还没开发，上次给的表格，里面字段跟系统上不一致，以哪个为准呢
[x] 后台能看到删除的业务数据

### 4-12 - 客户建议

[x] 小程序端登录时，需要校验角色，只有crm用户才可以登录
[x] 管理端登录需要校验校色，只有admin用户才可以登录
[x] crm管理端审核
[x] 清理数据
[x] 页面添加审核入口
[x] 小程序添加上传文件入口

### 4-17 - 客户建议

[ ] 参考企查查的交互方式修改现有的小程序
[x] 小程序需要适配动态字段，不能固定

## Q&A

### 前端项目安装依赖慢

主要原因: electron下载异常缓慢

windows解决方案:  预装electron和electron-builder

1. 下载压缩包: `https://www.steinstech.cn/resources/electron_install.zip`
2. 将压缩包中的electron和electorn-builder文件夹放在`~\AppData\Local`文件夹下


### 上传文件适配umijs的openapi插件

file类型需要转成`{uri: "微信的临时地址"} as any`, 参考`user_profile`的上传头像和昵称

