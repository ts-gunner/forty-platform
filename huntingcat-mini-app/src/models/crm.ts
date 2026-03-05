import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";

const initState: ReduxModel.CrmModelType = {
  addCustomerModalOpen: false,
};

export const crmModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    setAddCustomerModalOpen: (state, payload: boolean) => ({
      ...state,
      addCustomerModalOpen: payload,
    }),
  },
  effects: (dispatch) => ({
  }),
});
