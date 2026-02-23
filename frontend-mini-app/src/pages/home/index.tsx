import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
import { ATTACHMENT } from '../../constant/resource'
import './index.scss'
import { useState } from 'react'
import HomeTab from './HomeTab'

const tabList = [
    { title: "推荐" }, { title: "详情" },
]
export default function Index() {
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0)
    const [searchValue, setSearchValue] = useState("")
    const searchValueChange = (val: string) => {
        setSearchValue(val)
    }
    return (
        <View>
            <AtTabs
                current={currentTabIndex}
                tabList={tabList}
                onClick={(val) => setCurrentTabIndex(val)}
            >
                <AtTabsPane current={currentTabIndex} index={0}>
                    <AtSearchBar
                        value={searchValue}
                        onChange={(val) => searchValueChange(val)}
                    />

                    <Swiper
                        style={{ height: "200px" }}
                        indicatorColor='#999'
                        indicatorActiveColor='#333'
                        indicatorDots
                        autoplay>
                        <SwiperItem >
                            <Image mode='aspectFill' src={ATTACHMENT.promotion1} className='w-full h-full' />
                        </SwiperItem>
                        <SwiperItem>
                            <Image mode='aspectFill' src={ATTACHMENT.promotion2} className='w-full h-full' />
                        </SwiperItem>
                        <SwiperItem>
                            <Image mode='aspectFill' src={ATTACHMENT.promotion3} className='w-full h-full' />
                        </SwiperItem>
                    </Swiper>
                    <HomeTab />
                </AtTabsPane>
                <AtTabsPane current={currentTabIndex} index={1}>
                    <Image src={ATTACHMENT.public_service} mode="widthFix" className="w-full" />

                </AtTabsPane>
            </AtTabs>



        </View>
    )
}
