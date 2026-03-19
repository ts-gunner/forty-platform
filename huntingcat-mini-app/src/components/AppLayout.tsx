import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import { DispatchProp, useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import Taro from "@tarojs/taro";
import { ROUTERS } from "../constant/menus";
import { handleResponse, Notify } from "@/utils/common";
import { getCurrentUser } from "@/services/steins-admin/systemAuthController";
import { AtToast } from "taro-ui";

export function withGlobalLayout<T>(WrappedComponent: React.ComponentType<T>) {
  return (props: T) => {
    const router = Taro.useRouter();
    const dispatch = useDispatch<Dispatch>();
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
    useEffect(() => {
      if (router.path !== ROUTERS.login) {
        getLoginUser();
      }
    }, []);

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
