import { TabBarItem } from "@tarojs/taro"
interface ApiResult<T = any> {
  code?: number;
  msg?: string;
  data?: T;
}

declare namespace ReduxModel {
    type RouterModelType = {
        routerIndex: number
        tabList: TabBarItem[]
    }

    type CrmModelType = {
        tableFields: API.CrmEntityFieldVo[]  // 实体字段列表
        selectedEntityValue: API.CrmEntityValueVo  // 选中的客户信息
    }

    type NotificationModelType = {
        notifyOpen?: boolean
        notifyText?: string
        notifyIcon?: string
        notifyStatus?: "error" | "success" | "loading"
        timer?: NodeJS.Timeout
    }
}


declare namespace MockData {
    type CustomerDataType = {
        companyName: string  // 公司名称
        contractName: string  // 联系人名称
        contractPhone: string  // 联系人电话
        addr: string  // 公司地址
        position: string  // 岗位
        tag: string  // 分类

        key: string

    }
}