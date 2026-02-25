export default defineAppConfig({
  tabBar: {
    color: "#97a3b6",
    selectedColor: "#388E3C",
    backgroundColor: "#FFFFFF",
    list: [
      {
        pagePath: "pages/home/index",
        iconPath: "static/home.png",
        selectedIconPath: "static/home_active.png",
        text: "首页"
      },
  
      {
        pagePath: "pages/user/index",
        iconPath: "static/user.png",
        selectedIconPath: "static/user_active.png",
        text: "用户中心"
      }
    ]
  },
  entryPagePath: "pages/user/index",
  pages: [
    'pages/home/index', "pages/user/index"
  ],
  window: {
    navigationBarTitleText: '安健社区服务',
    navigationBarBackgroundColor: "#FFFFFF",
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: "requiredComponents",
  requiredBackgroundModes: []
})
