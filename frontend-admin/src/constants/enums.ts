// 存放枚举类

// 国际化
export enum LocaleLang {
  ZH_CN = "zh-CN",
  EN_US = "en-US",
}

export enum AgentKeyEnum {
  KNOWLEDGE = "knowledge",
  DATA = "data",
}

export const AgentKeyMap: Record<AgentKeyEnum, string> = {
  [AgentKeyEnum.KNOWLEDGE]: "知识库",
  [AgentKeyEnum.DATA]: "数据库",
};

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
}
