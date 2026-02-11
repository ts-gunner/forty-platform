import { ToasterRef } from "@/components/ui/toast/message";
import { LocaleLang } from "@/constants/enums";
import type { RootModel } from "@/models";
import { createModel } from "@rematch/core";

const initState: ReduxModel.GlobalType = {
  lang: LocaleLang.ZH_CN,
  theme: "light",
  toastRef: null,
};

export const globalModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    setToastRef: (state, payload: React.MutableRefObject<ToasterRef | undefined> | null) => ({
      ...state,
      toastRef: payload,
    }),
    setLang: (state, payload: LocaleLang) => ({
      ...state,
      lang: payload,
    }),
    setTheme: (state, payload: "light" | "dark") => ({
      ...state,
      lang: payload,
    }),
  },
});
