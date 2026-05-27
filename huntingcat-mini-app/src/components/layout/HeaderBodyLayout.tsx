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
    headerComponent?: React.ReactNode
    children: React.ReactNode
}
export default function HeaderBodyLayout({ headerComponent, rootClassName, children, bodyClassName }: LayoutProps) {
    const { navBarHeight } = useNavbar();
    return (
        <View className={cn("min-h-screen flex flex-col", rootClassName)}>

            {/* 头部组件 */}
            <View style={{
            }}>
                {headerComponent}
            </View>
            <View className={cn("flex-1",bodyClassName)}>
                {children}
            </View>


        </View>
    )
}
