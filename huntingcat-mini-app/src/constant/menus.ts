export const ROUTERS = {
  customer: "/pages/customer/index",
  allCustomer: "/pages/all_customer/index",
  collection: "/pages/collection/index",
  mine: "/pages/user/index",
  login: "/pages/login/index",

  privacy: "/pagesUser/privacy/index",
  policy: "/pagesUser/policy/index",
  accessPermission: "/pagesUser/access_perm/index",
  audit: "/pagesUser/audit/index",
  userProfile: "/pagesUser/user_profile/index",
  settings: "/pagesUser/settings/index",

  customerDetail: "/pagesCustomer/customer_detail/index",
  createCustomer: "/pagesCustomer/create_customer/index",
  searchCustomer: "/pagesCustomer/search/index",

  customerAnalysis: "/pagesAnalysis/analysis/index",
  customerAnalysisWithBiz: "/pagesAnalysis/analysisWithBiz/index",  // 查看业务员的客户增长量
};

export const DEFAULT_ROUTER = ROUTERS.customer;

export const DISABLED_CHECK_LOGIN_ROUTERS = [
  ROUTERS.login,
  ROUTERS.privacy,
  ROUTERS.policy,
  ROUTERS.accessPermission,
];
export default [
  {
    text: "我的客户",
    iconPath: "/static/customer.png",
    selectedIconPath: "/static/customer_active.png",
    pagePath: ROUTERS.customer,
  },
  {
    text: "全部客户",
    iconPath: "/static/all_customer.png",
    selectedIconPath: "/static/all_customer_active.png",
    pagePath: ROUTERS.allCustomer,
  },
  {
    text: "收藏",
    iconPath: "/static/collection.png",
    selectedIconPath: "/static/collection_active.png",
    pagePath: ROUTERS.collection,
  },

  {
    text: "我的",
    iconPath: "/static/user.png",
    selectedIconPath: "/static/user_active.png",
    pagePath: ROUTERS.mine,
  },
];
