import type { RootModel } from "@/models";
import { createModel } from "@rematch/core";

const initState: ReduxModel.AuthType = {
  userInfo: {}
};

export const authModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    setUserInfo: (state, payload: API.UserLoginVo) => ({
      ...state,
      userInfo: payload,
    }),
 
  },
});
