import { ROUTERS } from "@/constant/menus";
import { store } from "@/store";
import { ApiResult } from "@/typing";
import Taro from "@tarojs/taro";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
let isRun = false;
const executeFunction = (func: () => void) => {
  if (!isRun) {
    isRun = true;
    func();
    // 2秒后重置状态，允许下一次报错
    setTimeout(() => {
      isRun = false;
    }, 2000);
  }
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function handleResponse<T = any>({
  resp,
  onSuccess,
  onError,
  onFinish,
}: {
  resp: ApiResult<T>;
  onSuccess?: (data: T) => void;
  onError?: (data: T) => void;
  onFinish?: () => void;
}) {
  try {
    if (!resp) {
      Notify.fail("系统错误：服务连接异常!!");
      return;
    }
    if (resp.code === 401) {
      executeFunction(() => {
        Notify.fail("登录过期");
        store.dispatch.routerModel.navigateTo({ url: ROUTERS.login });
      });
    }
    if (resp.code === 500) {
      Notify.fail(resp.msg);
    } else if (resp.code === 200) {
      onSuccess?.(resp.data as T);
    } else {
      onError?.(resp.data as T);
    }
  } finally {
    onFinish?.();
  }
}

export class Notify {
  // 显示加载中
  static loading(message: string) {
    store.dispatch.notificationModel.notifyLoading(message);
  }

  static ok(message: string) {
    store.dispatch.notificationModel.notifyOk(message);
  }

  static fail(message: string) {
    store.dispatch.notificationModel.notifyFail(message);
  }
  static clear() {
    store.dispatch.notificationModel.hideNotify();
  }
}
