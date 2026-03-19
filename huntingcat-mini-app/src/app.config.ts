export default defineAppConfig({
  tabBar: {
    custom: true,
    // color: "#97a3b6",
    // selectedColor: "#388E3C",
    // backgroundColor: "#FFFFFF",
    list: [
      
        {
              text: "我的客户",
              iconPath: "static/customer.png",
              selectedIconPath: "static/customer_active.png",
              pagePath: "pages/customer/index"
          },
          {
              text: "全部客户",
              iconPath: "static/all_customer.png",
              selectedIconPath: "static/all_customer_active.png",
              pagePath: "pages/all_customer/index"
          },
           {
              text: "收藏",
              iconPath: "static/collection.png",
              selectedIconPath: "static/collection_active.png",
              pagePath: "pages/collection/index"
          },
        
          {
              text: "我的",
              iconPath: "static/user.png",
              selectedIconPath: "static/user_active.png",
              pagePath: "pages/user/index"
          },
    ]
  },
  entryPagePath: "pages/user_profile/index",
  pages: [
    'pages/all_customer/index', 'pages/customer/index',  'pages/collection/index',"pages/user/index", "pages/settings/index",
    "pages/customer_detail/index", "pages/create_customer/index", "pages/login/index", "pages/user_profile/index"
  
  ],
  window: {
  },
  lazyCodeLoading: "requiredComponents",
  requiredBackgroundModes: []
})
