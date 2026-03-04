import { Dispatch, RootState } from '@/store'
import { View, Text, Image } from '@tarojs/components'
import Taro, { TabBarItem } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import "./index.scss"
import { useNavbar } from '../context/NavbarContext'
import { ICON_MAP, THEME_CONFIG } from '../constant/global'
export default function CustomTabBar() {
  const dispatch = useDispatch<Dispatch>()
  const { tabBarHeight } = useNavbar()
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
              // onClick={handlePlusClick}
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
                    src={ICON_MAP.plusIcon}
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
      <Image src={isActive ? tabItem.selectedIconPath : tabItem.iconPath} style={{
        height: "24px", width: "24px"
      }} />
      <Text style={{
        fontSize: "0.8em",
        color: isActive ? THEME_CONFIG.active : THEME_CONFIG.inactive,
        fontWeight: isActive ? 600: 400
      }}>{tabItem.text}</Text>

    </View>
  )
}