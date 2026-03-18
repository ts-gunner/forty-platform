
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
  static ok(message: string) {
    // store.getState().globalModel.toastRef?.current?.show({
    //   message: message,
    //   variant: "success",
    // });
  }
  static fail(message: string) {
    // store.getState().globalModel.toastRef?.current?.show({
    //   message: message,
    //   variant: "error",
    // });
  }
}
