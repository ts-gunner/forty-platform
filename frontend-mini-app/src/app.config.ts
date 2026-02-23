export default defineAppConfig({
  tabBar: {
    color: "black",
    selectedColor: "#007aff",
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
        iconPath: "static/mine.png",
        selectedIconPath: "static/mine_active.png",
        text: "用户中心"
      }
    ]
  },
  entryPagePath: "pages/home/index",
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
