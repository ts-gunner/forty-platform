
import Taro from "@tarojs/taro";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export function handleResponse<T>({
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
  static loading(message: string = '加载中...') {
    Taro.showLoading({
      title: message,
      mask: true // 防止用户在加载时乱点
    })
  }

  static ok(message: string) {
    Taro.hideLoading() // 关键：先关闭 Loading
    setTimeout(() => { // 稍微延迟确保 Loading 彻底消失，Toast 弹出更稳健
      Taro.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      })
    }, 50)
  }

  static fail(message: string) {
    Taro.hideLoading()
    setTimeout(() => {
      Taro.showToast({
        title: message || '操作失败',
        icon: 'error',
        duration: 2000
      })
    }, 50)
  }
}
