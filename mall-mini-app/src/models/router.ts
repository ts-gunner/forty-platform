import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";
import menus from "../constant/menus";
import Taro from "@tarojs/taro";

const initState: ReduxModel.RouterModelType = {
  routerIndex: 0,
  tabList: menus,
  activeRoute: "",
};

export const routerModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    setRouteIndex: (state, payload: number) => ({
      ...state,
      routerIndex: payload,
    }),
    setActiveRoute: (state, payload: string) => ({
      ...state,
      activeRoute: payload,
    }),
  },
  effects: (dispatch) => ({
    switchTab: (
      payload: {
        url: string;
      },
      state,
    ) => {
      Taro.switchTab({ url: payload.url });
      dispatch.routerModel.setActiveRoute(payload.url);

    },
    navigateTo: (
      payload: {
        url: string;
      },
      state,
    ) => {
      dispatch.routerModel.setActiveRoute(payload.url);
      Taro.navigateTo({ url: payload.url });
    },

    navigateBack: () => {
      const pages = Taro.getCurrentPages()
      const pageLength = pages.length
      if (pageLength >= 2) {
         const backUrl = "/" + pages[pageLength - 2].route
         dispatch.routerModel.setActiveRoute(backUrl)
         Taro.navigateBack()
      }
    }
  }),
});
