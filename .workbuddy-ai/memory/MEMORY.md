# Project Memory — forty-platform

## 项目概述
forty-platform 是一个包含后端(Go)、前端管理台(React)、小程序(微信)的综合性平台。
- backend/ — Go 后端
- frontend-admin/ — 管理后台前端
- huntingcat-mini-app/ — 微信小程序
- mall-mini-app/ — 商城微信小程序
- mall-proto/ — 商城原型（React + Vite，快速原型工具）

## mall-proto 设计约定
- 视觉风格：暗色科技风（Dark Tech），面向海外媒体设备商城
- 配色：背景 #0D0F14/#12151C/#161A22，强调色 #2F80ED/#00E5FF
- 技术栈：React 18 + Vite 5 + React Router DOM 6 + 纯 CSS 变量主题
- 图片占位：picsum.photos
- 样式方式：CSS 变量 + .css 文件（未用 Tailwind，保持轻量）

## 原型进度
- [x] 首页 Home
- [x] 产品列表页 ProductList（分类筛选+排序）
- [x] 产品详情页 ProductDetail（图片/视频轮播+供应商卡片+图文详情）
- [x] 供应商列表页 SupplierList（搜索+分类筛选）
- [x] 供应商详情页 SupplierDetail（联系方式+产品列表）
- [x] 申请入驻页 ApplySupplier（表单+Toast+成功页）
- [x] 我的页面 Profile（头像+统计+菜单）
- [x] 底部导航 5 Tab（Home/Products/Suppliers/Apply/Profile）
- 全部页面已完成，原型完整可预览
