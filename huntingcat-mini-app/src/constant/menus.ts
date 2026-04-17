export const ROUTERS = {
  customer: "/pages/customer/index",
  allCustomer: "/pages/all_customer/index",
  collection: "/pages/collection/index",
  mine: "/pages/user/index",
  userProfile: "/pages/user_profile/index",
  settings: "/pages/settings/index",
  customerDetail: "/pages/customer_detail/index",
  createCustomer: "/pages/create_customer/index",
  login: "/pages/login/index",
  privacy: "/pages/privacy/index",
  policy: "/pages/policy/index",
  accessPermission: "/pages/access_perm/index",
  audit: "/pages/audit/index",
  searchCustomer: "/pages/search/index",
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
