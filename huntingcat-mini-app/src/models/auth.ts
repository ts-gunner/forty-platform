import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import Taro from "@tarojs/taro";
import { DEFAULT_ROUTER, ROUTERS } from "../constant/menus";
import {
  approvalWechatAccess,
  wechatCrmLogin,
} from "@/services/steins-admin/systemAuthController";
import { handleResponse, Notify } from "@/utils/common";
import storage from "@/utils/storage";

type AuthType = {
  isAuth: boolean;
  userInfo: API.LoginUserVo;
};
const initState: AuthType = {
  isAuth: false,
  userInfo: {},
};

export const authModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    setIsAuth: (state: AuthType, payload: boolean) => {
      return {
        ...state,
        isAuth: payload,
      };
    },
    setUserInfo: (state: AuthType, payload: API.LoginUserVo) => {
      return {
        ...state,
        userInfo: payload,
      };
    },
  },
  effects: (dispatch) => ({
    userLogin: async (code: string) => {
      Notify.loading("登录中...");

      const resp = await wechatCrmLogin({
        code,
      });
      handleResponse({
        resp,
        onSuccess: (data) => {
          storage.setItem("token", data);
          dispatch.authModel.setIsAuth(true);
          dispatch.routerModel.switchTab({ url: DEFAULT_ROUTER });
          Notify.ok(resp.msg || "");
        },
        onError: () => {
          Notify.fail(resp.msg || "");
        },
        onFinish: () => {},
      });
    },
    doLogout: () => {
      dispatch.authModel.setIsAuth(false);
      storage.removeItem("token");
      dispatch.routerModel.navigateTo({ url: ROUTERS.login });
    },
    applyAccessPermission: async (payload: {
      auditCode: string;
      name: string;
      remark: string;
    }) => {
      Notify.loading("正在提交中....")
      const loginResp = await Taro.login();
      const resp = await approvalWechatAccess({
        loginCode: loginResp.code,
        auditCode: payload.auditCode,
        auditName: payload.name,
        auditRemark: payload.remark,
      });
      handleResponse({
        resp,
        onSuccess: () => {
          Notify.ok("提交成功");
          dispatch.routerModel.navigateTo({ url: ROUTERS.login });
        },
        onError: () => {
          Notify.fail(resp.msg);
        },
      });
    },
  }),
});
