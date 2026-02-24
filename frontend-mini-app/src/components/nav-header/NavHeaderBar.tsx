import { View, Text } from "@tarojs/components";
import {
  getMenuButtonBoundingClientRect,
  getSystemInfoSync,
} from "@tarojs/taro";
import { useEffect, useState } from "react";

export default function NavHeaderBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navBarHeight, setNavBarHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const getNavHeight = () => {
    let menuButtonObject = getMenuButtonBoundingClientRect();
    let sysinfo = getSystemInfoSync();
    let statusBarHeight = sysinfo.statusBarHeight as number; // 状态栏高度
    let menuHeight = menuButtonObject.height; // 胶囊顶部高度
    let menuTop = menuButtonObject.top; // 胶囊距离顶部的高度
    let navHeight =
      statusBarHeight + menuHeight + (menuTop - statusBarHeight) * 2;
    setNavBarHeight(navHeight);
    setHeaderHeight(navHeight - statusBarHeight);
  };
  useEffect(() => {
    getNavHeight();
  }, []);
  return (
    <View
      className="flex items-end"
      style={{
        height: `${navBarHeight}px`,
        background: "linear-gradient(180deg,#B3C2A3 0%,#DEECCF 100%)",
      }}
    >
      <View
        className="flex items-center"
        style={{
          height: `${headerHeight}px`,
        }}
      >
        {children}
      </View>
    </View>
  );
}
