import { cn } from "@/utils/common";
import { useNavbar } from "@/context/NavbarContext";
import { Button, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { AtIcon } from "taro-ui";
import { useDispatch } from "react-redux";
import { Dispatch } from "@/store";
/**
上中下布局
头部是常规的微信navbar高度
 */
export default function HeaderBodyFooterLayout({
  headerRender,
  FooterRender,
  title,
  children,
  className,
}: {
  headerRender?: React.ReactNode;
  FooterRender?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const dispatch = useDispatch<Dispatch>();
  const { navBarHeight, headerHeight } = useNavbar();
  return (
    <View className={cn("min-h-screen relative", className)}>
      {/* 头部 */}
      <View
        className="fixed top-0 left-0 right-0 bg-white flex items-end z-[50] w-full shrink-0"
        style={{
          height: `${navBarHeight}px`,
        }}
      >
        <View
          className="w-full flex-1 flex items-center"
          style={{
            height: `${headerHeight}px`,
          }}
        >
          {headerRender ? (
            headerRender
          ) : (
            <View className="flex-1 w-full grid grid-cols-3">
              <View onClick={() => dispatch.routerModel.navigateBack()}>
                <AtIcon value="chevron-left" size="24" />
              </View>
              <View className="text-center">
                <Text className="font-[600] text-lg">{title}</Text>
              </View>
              <View></View>
            </View>
          )}
        </View>
      </View>
      {/* 主体内容 */}
      <View 
        className="w-full box-border"
        style={{ 
          paddingTop: `${navBarHeight}px`,
          paddingBottom: FooterRender ? '120rpx' : '40rpx' // 确保不被底部按钮遮挡
        }}
      >
        {children}
      </View>
      {/* 底部 */}
      {FooterRender && (
        <View className="fixed bottom-0 left-0 right-0 z-[50] w-full shrink-0 safe-bottom">
          {FooterRender}
        </View>
      )}
    </View>
  );
}
