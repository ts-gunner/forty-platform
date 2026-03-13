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
  Text = 1, // 文本
  Number = 2, // 数字
  Boolean = 3, // 布尔值
  Picker = 4, // 选择器
  Date = 5, // 日期
  Region = 6, // 行政区划
}
