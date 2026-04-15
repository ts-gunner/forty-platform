// 存放枚举类

// 国际化
export enum LocaleLang {
  ZH_CN = "zh-CN",
  EN_US = "en-US",
}

export enum SystemRoleEnum {
  ROLE_WECHAT_CRM = "wechat_crm_user",
}

export const StatusOptions = [
  {
    label: "可用",
    value: 1,
  },
  {
    label: "不可用",
    value: 0,
  },
];

export enum CrmDataTypeEnum {
  Text = "text", // 文本
  TextArea = "textarea", // 多行文本
  Number = "number", // 数字
  Boolean = "bool", // 布尔值
  Picker = "picker", // 选择器
  Date = "date", // 日期
  Region = "region", // 行政区划
  Location = "location", // 定位器
  PickerOrOther = "picker_or_other", // 选择器或者其他自定义普通文本
}
