import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";

const initState: ReduxModel.GlobalModelType = {
    notifyOpen: false,
    notifyText: "请稍等"
};

export const globalModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    setNotifyOpen: (state, payload: boolean) => ({
        ...state,
        notifyOpen: payload
    }),
    setNotifyText: (state, payload: string) => ({
        ...state,
        notifyText: payload
    }),
  },
  effects: (dispatch) => ({
    notifyLoading: (payload:string) => {
        dispatch.globalModel.setNotifyText(payload)
        dispatch.globalModel.setNotifyOpen(true)
    },
    notifyEnd: () => {
        dispatch.globalModel.setNotifyOpen(false)
    }
  }),
});
