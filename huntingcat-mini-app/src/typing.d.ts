import { TabBarItem } from "@tarojs/taro"

declare namespace ReduxModel {
    type RouterModelType = {
        routerIndex: number
        tabList: TabBarItem[]
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

    }
}