import React from 'react'
import { View } from '@tarojs/components'
export default function PageContainer(
    { children,style }: {
        children: React.ReactNode,
        style?: object
    }) {
    return (
        <View style={{  ...style,display: "flex", justifyContent: "center"}}>
            <View style={{ width: "95%",marginTop: "5%"}}>
                {children}
            </View>
        </View>
    )
}
