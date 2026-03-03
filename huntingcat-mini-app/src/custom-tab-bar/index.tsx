import { Dispatch, RootState } from '@/store'
import {  View, Text, Image } from '@tarojs/components'
import Taro, { TabBarItem } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import "./index.scss"
import { useNavbar } from '../context/NavbarContext'
export default function CustomTabBar() {
  const dispatch = useDispatch<Dispatch>()
  const {tabBarHeight} = useNavbar()
  const tabList = useSelector((state:RootState) => state.routerModel.tabList)
  const clickTab = (index: number, path: string) => {
    dispatch.routerModel.setRouteIndex(index)
    Taro.switchTab({url: path})
  }
  return (
    <View className='glass-navbar' style={{
      
    }}>
      {
        tabList.map((it, idx) => (
          <TabItem tabItem={it} key={idx} clickRouter={clickTab} index={idx} />
        ))
      }
    </View>
  )
}

const TabItem = ({tabItem,clickRouter,index}:{index: number, tabItem: TabBarItem; clickRouter: (index: number, path: string) => void}) => {
  return (
    <View style={{
      display: 'flex',
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "4px",
      flexGrow: 1,
    }} onClick={() => {
      clickRouter(index, tabItem.pagePath)
    }}>
      <Image  src={tabItem.iconPath} style={{
        height: "24px", width: "24px"
      }}/>
      <Text style={{
        fontSize: "0.8em"
      }}>{tabItem.text}</Text>
        
    </View>
  )
}