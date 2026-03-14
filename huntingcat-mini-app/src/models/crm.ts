import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";

const initState: ReduxModel.CrmModelType = {
};

export const crmModel = createModel<RootModel>()({
  state: initState,
  reducers: {

  },
  effects: (dispatch) => ({
  }),
});
