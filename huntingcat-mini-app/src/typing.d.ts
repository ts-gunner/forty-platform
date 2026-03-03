import { TabBarItem } from "@tarojs/taro"

declare namespace ReduxModel {
    type RouterModelType = {
        routerIndex: number
        tabList: TabBarItem[]
    }
}