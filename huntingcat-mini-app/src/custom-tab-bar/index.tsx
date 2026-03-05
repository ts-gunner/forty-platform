import { Dispatch, RootState } from '@/store'
import { View, Text, Image } from '@tarojs/components'
import Taro, { TabBarItem } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import "./index.scss"
import { ICON_MAP, THEME_CONFIG } from '../constant/global'
function CustomTabBar() {
  const dispatch = useDispatch<Dispatch>()
 
  const tabList = useSelector((state: RootState) => state.routerModel.tabList)
  const routerIndex = useSelector((state: RootState) => state.routerModel.routerIndex)
  const clickTab = (index: number, path: string) => {
    dispatch.routerModel.setRouteIndex(index)
    Taro.switchTab({ url: path })
  }
 
  return (
    <View className='glass-navbar'>
      {
        tabList.map((it, idx) => {
          const items = [
            <TabItem tabItem={it} key={idx} onClick={() => clickTab(idx, it.pagePath)} isActive={idx === routerIndex} />
          ]
          if (idx === 1) {
            items.push(
              <View
                key="plus-btn"
                style={{
                  position: "relative",
                  display: 'flex',      // 新增：容器内居中
                  flex: "1 1 0%",           // 新增：平分导航栏空间
                  justifyContent: 'center', // 新增
                  alignItems: 'center',     // 新增
                  height: '100%'        // 确保高度充满以对齐
                }}
              onClick={() => {
                dispatch.crmModel.setAddCustomerModalOpen(true)
              }}
              >
                <View style={{
                  top: "-20px",        // 让圆球向上偏移
                  position: "relative",
                  width: '48px',
                  height: '48px',
                  backgroundColor: THEME_CONFIG.active,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}>
                  <Image
                    src="data:image/png;base64,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"
                    style={{
                      width: '30px',
                      height: '30px',
                    }}
                  />
                </View>

              </View>
            )
          }
          return items
        })
      }
    </View>
  )
}

const TabItem = ({ tabItem, onClick, isActive }: { isActive: boolean, tabItem: TabBarItem; onClick: () => void }) => {
  return (
    <View style={{
      display: 'flex',
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "4px",
      flex: "1 1 0%"
    }} onClick={onClick}>
 
      <Image 
        src={tabItem.selectedIconPath} 
        style={{ height: "24px", width: "24px", display: isActive ? 'block' : 'none' }} 
      />
      <Image 
        src={tabItem.iconPath} 
        style={{ height: "24px", width: "24px", display: isActive ? 'none' : 'block' }} 
      />
      <Text style={{
        fontSize: "0.8em",
        color: isActive ? THEME_CONFIG.active : THEME_CONFIG.inactive,
        fontWeight: isActive ? 600: 400
      }}>{tabItem.text}</Text>

    </View>
  )
}


CustomTabBar.options = {
  addGlobalClass: true
}

export default CustomTabBar