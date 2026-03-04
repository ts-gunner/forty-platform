export default defineAppConfig({
  tabBar: {
    custom: true,
    // color: "#97a3b6",
    // selectedColor: "#388E3C",
    // backgroundColor: "#FFFFFF",
    list: [
      
        {
              text: "我的客户",
              iconPath: "/static/customer.png",
              selectedIconPath: "/static/customer_active.png",
              pagePath: "pages/customer/index"
          },
          {
              text: "全部客户",
              iconPath: "/static/all_customer.png",
              selectedIconPath: "/static/all_customer_active.png",
              pagePath: "pages/all_customer/index"
          },
           {
              text: "收藏",
              iconPath: "/static/collection.png",
              selectedIconPath: "/static/collection_active.png",
              pagePath: "pages/collection/index"
          },
        
          {
              text: "我的",
              iconPath: "/static/user.png",
              selectedIconPath: "/static/user_active.png",
              pagePath: "pages/user/index"
          },
    ]
  },
  entryPagePath: "pages/customer/index",
  pages: [
    'pages/all_customer/index', 'pages/customer/index',  'pages/collection/index',"pages/user/index", "pages/settings/index"
  ],
  window: {
    navigationBarTitleText: '安健社区服务',
    navigationBarBackgroundColor: "#FFFFFF",
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: "requiredComponents",
  requiredBackgroundModes: []
})
