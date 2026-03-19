import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { ReduxModel } from "@/typing";

const initState: ReduxModel.NotificationModelType = {
  notifyOpen: false,
  notifyText: "请稍等",
  notifyIcon: "",
  notifyStatus: undefined,
  timer: undefined,
};

export const notificationModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    updateNotify(state, payload: ReduxModel.NotificationModelType) {
      return { ...state, ...payload };
    },
    resetNotify(state) {
      if (state.timer) clearTimeout(state.timer);
      return { ...initState };
    },
  },
  effects: (dispatch) => ({
    _showAndAutoClose(
      {
        text,
        icon,
        status,
        duration = 2000,
      }: { text: string; icon?: string; status?: any; duration?: number },
      rootState,
    ) {
      const { timer } = rootState.notificationModel;
      if (timer) clearTimeout(timer);
   
      dispatch.notificationModel.updateNotify({
        notifyOpen: true,
        notifyText: text,
        notifyIcon: icon || "",
        notifyStatus: status,
      });

      const newTimer = setTimeout(() => {
        dispatch.notificationModel.updateNotify({ notifyOpen: false });
      }, duration);

      dispatch.notificationModel.updateNotify({ timer: newTimer });
    },
    notifyLoading(payload: string) {
      dispatch.notificationModel._showAndAutoClose({
        text: payload,
        status: "loading",
      });
    },

    notifyOk(payload: string) {
      dispatch.notificationModel._showAndAutoClose({
        text: payload,
        icon: "check-circle",
      });
    },

    notifyFail(payload: string) {
      dispatch.notificationModel._showAndAutoClose({
        text: payload,
        icon: "alert-circle",
      });
    },

    // 手动关闭
    hideNotify() {
      dispatch.notificationModel.resetNotify();
    },
  }),
});
