import { getPersistor } from "@rematch/persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { PropsWithChildren, useEffect } from "react";
import { useLaunch } from "@tarojs/taro";
import { Provider } from "react-redux";
import { store } from "./store";

import "./app.scss";
import { NavbarProvider } from "./context/NavbarContext";

const persistor = getPersistor();

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
    if (process.env.TARO_ENV !== 'h5') {
      (global as any).FormData = class FormData {
        private _data: Record<string, any> = {};

        // 核心：让生成的代码执行 append 时，把数据存入 _data
        append(key: string, value: any) {
          this._data[key] = value;
        }

        // 自定义方法：方便我们在拦截器里把数据取出来
        getInternalData() {
          return this._data;
        }
      };
    }
  });

  // children 是将要会渲染的页面
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <NavbarProvider>{children}</NavbarProvider>
      </Provider>
    </PersistGate>
  );
}

export default App;
