import { createContext, useContext, useEffect, useState } from "react";
import {
  getMenuButtonBoundingClientRect,
  getSystemInfoSync,
} from "@tarojs/taro";

type NavbarContextType = {
  navBarHeight: number; // 导航高度
  headerHeight: number; // 导航中头部内容的高度
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    <NavbarContext.Provider
      value={{
        navBarHeight: navBarHeight,
        headerHeight: headerHeight,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
