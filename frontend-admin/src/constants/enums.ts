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

export const AgentKeyMap:Record<AgentKeyEnum, string> = {
  [AgentKeyEnum.KNOWLEDGE]: "知识库",
  [AgentKeyEnum.DATA]: "数据库",
}

export const StatusOptions = [
  {
    label: "可用",
    value: 1
  },
    {
    label: "不可用",
    value: 0
  },
]