import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import { DispatchProp, useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import Taro, { useDidShow } from "@tarojs/taro";
import { DISABLED_CHECK_LOGIN_ROUTERS, ROUTERS } from "../constant/menus";
import { handleResponse, Notify } from "@/utils/common";
import { getCurrentUser } from "@/services/steins-admin/systemAuthController";
import { AtToast } from "taro-ui";

export function withGlobalLayout<T>(WrappedComponent: React.ComponentType<T>) {
  return (props: T) => {
    const dispatch = useDispatch<Dispatch>();
    const activeRoute = useSelector(
      (state: RootState) => state.routerModel.activeRoute,
    );
    const notifyOpen = useSelector(
      (state: RootState) => state.notificationModel.notifyOpen,
    );
    const notifyText = useSelector(
      (state: RootState) => state.notificationModel.notifyText,
    );
    const notifyIcon = useSelector(
      (state: RootState) => state.notificationModel.notifyIcon,
    );
    const notifyStatus = useSelector(
      (state: RootState) => state.notificationModel.notifyStatus,
    );

    useDidShow(() => {
      const currentPath = Taro.getCurrentInstance().router?.path || "";

      dispatch.routerModel.setActiveRoute(currentPath);

      // 3. 鉴权拦截与请求：只在当前显示页面且不在白名单内时触发
      if (currentPath && !DISABLED_CHECK_LOGIN_ROUTERS.includes(currentPath)) {
        getLoginUser();
      }

      // 4. 回到顶部
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
    });

    const getLoginUser = async () => {
      const resp = await getCurrentUser();
      handleResponse({
        resp,
        onSuccess: (data) => {
          dispatch.authModel.setUserInfo(data);
        },
        onError: () => {
          Notify.fail("登录异常:" + resp.msg);
        },
      });
    };
    return (
      <View style={{ height: "100%" }}>
        <AtToast
          isOpened={notifyOpen}
          text={notifyText}
          duration={0}
          icon={notifyIcon}
          status={notifyStatus}
          hasMask={true}
        />
        {/* 渲染原页面内容 */}
        <WrappedComponent {...props} />
      </View>
    );
  };
}
