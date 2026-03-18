import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import Taro from "@tarojs/taro";
import { ROUTERS } from "../constant/menus";
import { wechatCrmLogin } from "@/services/steins-admin/systemAuthController";
import { handleResponse } from "@/utils/common";

type UserInfoType = {
  nickname: string;
  avatar?: string;
};
type AuthType = {
  isAuth: boolean;
  userInfo: UserInfoType;
  authLoading: boolean;
};
const initState: AuthType = {
  isAuth: false,
  userInfo: {
    nickname: "微信用户",
  },
  authLoading: false,
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
    setUserInfo: (state: AuthType, payload: UserInfoType) => {
      return {
        ...state,
        userInfo: payload,
      };
    },
    setAuthLoading: (state: AuthType, payload: boolean) => {
      return {
        ...state,
        authLoading: payload,
      };
    },
  },
  effects: (dispatch) => ({
    userLogin: async (code: string) => {
      dispatch.authModel.setAuthLoading(true);

      const resp = await wechatCrmLogin({
        code,
      });
      handleResponse({
        resp,
        onSuccess: () => {
          dispatch.authModel.setUserInfo({
            nickname: "大聪明",
          });
          Taro.switchTab({ url: ROUTERS.mine });
        },
        onFinish: () => {
          dispatch.authModel.setAuthLoading(false);
        },
      });
    },
    doLogout: () => {
      dispatch.authModel.setIsAuth(false);
      Taro.navigateTo({ url: ROUTERS.login });
    },
  }),
});
