import { useNavbar } from '@/context/NavbarContext'
import { cn } from '@/utils/common'
import { View } from '@tarojs/components'
import React from 'react'
/**
 * 头部 + 主体内容。
 * 头部不只是微信的navbar
 */
type LayoutProps = {
    rootClassName?: string
    bodyClassName?: string
    headerHeight?: number
    headerComponent?: React.ReactNode
    children: React.ReactNode
}
export default function HeaderBodyLayout({ headerComponent, headerHeight, rootClassName, children, bodyClassName }: LayoutProps) {
    const { navBarHeight } = useNavbar();
    return (
        <View className={cn(rootClassName)}>
            {/* 头部组件 */}
            <View style={{
                height: `${headerHeight || navBarHeight}px`
            }}>
                {headerComponent}
            </View>
            <View className={cn(bodyClassName)}>
                {children}
            </View>


        </View>
    )
}
