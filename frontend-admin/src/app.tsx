import appLocales from "@/locales";
import { Dispatch, RootState, store } from "@/store";
import { getPersistor } from "@rematch/persist";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import React, { useEffect, useRef } from "react";
import { IntlProvider } from "react-intl";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { AppWrapper } from "./components/common/PageMeta";
import Toaster, { ToasterRef } from "./components/ui/toast/message";
import { LocaleLang } from "./constants/enums";
import { ThemeProvider } from "./context/ThemeContext";

function getAntdLocale(locale: LocaleLang) {
  if (locale === LocaleLang.ZH_CN) {
    return zhCN;
  } else if (locale === LocaleLang.EN_US) {
    return enUS;
  }
}
function getDayjsLocale(locale: LocaleLang) {
  if (locale === LocaleLang.ZH_CN) {
    return "zh-cn";
  } else if (locale === LocaleLang.EN_US) {
    return "en-us";
  }
}

const persistor = getPersistor();
export function rootContainer(container: React.ReactNode) {
  return (
    <ThemeProvider>
      <AppWrapper>
        <PersistGate persistor={persistor}>
          <Provider store={store}>
            <App container={container} />
          </Provider>
        </PersistGate>
      </AppWrapper>
    </ThemeProvider>
  );
}

const App = ({ container }: { container: React.ReactNode }) => {
  const locale = useSelector((state: RootState) => state.globalModel.lang);
  const toastRef = useSelector((state: RootState) => state.globalModel.toastRef);
  const dispatch = useDispatch<Dispatch>();
  const ref = useRef<ToasterRef>();
  useEffect(() => {
    if (ref) {
      dispatch.globalModel.setToastRef(ref);
    }

    return () => {
      dispatch.globalModel.setToastRef(null);
    };
  }, [dispatch,ref]);
  return (
    // @ts-ignore
    <IntlProvider locale={locale} messages={appLocales[locale]}>
      <ConfigProvider
        locale={getAntdLocale(locale)}
        theme={{
          token: {
            colorPrimary: "#2581E4",
          },
        }}
      >
        <Toaster ref={toastRef} />
        {container}
      </ConfigProvider>
    </IntlProvider>
  );
};
