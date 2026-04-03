export const APP_CONFIG = {
  title: "猎猫传媒",
};

// 后端前缀url
export const API_PREFIX_URL = "http://192.168.3.198:18888/ft";
// export const API_PREFIX_URL = "https://www.huntingcat.top/ft";
// export const API_PREFIX_URL = "http://8.163.58.128/ft";

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_CUSTOMER_DATA = {
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  data: {},
};

// 图片素材
export const IMAGE_MAP = {};

// 图标素材
export const ICON_MAP = {
  // searchLogo: "https://pic1.imgdb.cn/item/69b66abc0a6745dc77dc11e0.png",
  loginLogo: "https://pic1.imgdb.cn/item/69b57d120ee6511f188d3ae7.png",
  defaultAvatar: "https://pic1.imgdb.cn/item/69bb6f8eb96fa53fd04d16c1.png",
  settingIcon: "https://pic1.imgdb.cn/item/699e859d86daecd63652ecd0.png",
  plusIcon: "https://pic1.imgdb.cn/item/69a84153d42b5a8b853284b7.png",
  EmptyIcon: "https://pic1.imgdb.cn/item/69bffee6ccd26bacb4d99377.png", // 空空如也
  visitRecordIcon: "https://pic1.imgdb.cn/item/69a989ab49a76f9266b108a9.png", // 拜访记录
  phoneRecordIcon: "https://pic1.imgdb.cn/item/69a98a0649a76f9266b10908.png", // 电话记录
  rangCompanyIcon: "https://pic1.imgdb.cn/item/69a98aa449a76f9266b109a9.png", // 附近企业
  goodFlowIcon: "https://pic1.imgdb.cn/item/69b677ac0a6745dc77dc4cda.png", // 物品流向
};

export const THEME_CONFIG = {
  active: "#B84A4A",
  inactive: "#97a3b6",
};

export const CRM_TABLE_CODE = "huntingcat_customer";

export const CRM_ROLE_NAME = "wechat_crm_user";

export const FAVORITE_FIELD_KEY = "is_favorite";
