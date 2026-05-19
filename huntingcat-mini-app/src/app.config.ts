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
        pagePath: "pages/customer/index",
      },
      {
        text: "全部客户",
        iconPath: "static/all_customer.png",
        selectedIconPath: "static/all_customer_active.png",
        pagePath: "pages/all_customer/index",
      },
      {
        text: "收藏",
        iconPath: "static/collection.png",
        selectedIconPath: "static/collection_active.png",
        pagePath: "pages/collection/index",
      },

      {
        text: "我的",
        iconPath: "static/user.png",
        selectedIconPath: "static/user_active.png",
        pagePath: "pages/user/index",
      },
    ],
  },
  entryPagePath: "pages/customer/index",
  pages: [
    "pages/customer/index",
    "pages/all_customer/index",
    "pages/collection/index",
    "pages/user/index",
    "pages/login/index",
  ],
  subPackages: [
    {
      root: "pagesCustomer",
      pages: [
        "customer_detail/index",
        "create_customer/index",
        "search/index",
      ],
    },
    {
      root: "pagesUser",
      pages: [
        "settings/index",
        "user_profile/index",
        "policy/index",
        "privacy/index",
        "access_perm/index",
        "audit/index",
      ],
    },
    {
      root: "pagesAnalysis",
      pages: [
        "analysis/index",
        "analysisWithBiz/index",
      ],
    },
  ],

  preloadRule: {
    "pages/customer/index": {
      network: "all",
      packages: ["pagesCustomer"], // 提前静默下载客户详情、新建、分析等页面
    },
  },
  window: {},
  lazyCodeLoading: "requiredComponents",
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序位置接口的效果展示",
    },
  },
  requiredBackgroundModes: ["location"],
  requiredPrivateInfos: ["getLocation", "chooseLocation"],
});
