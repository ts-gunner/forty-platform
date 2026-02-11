import { SIGN_IN } from "@/constants/config";
import { history as umiHistory } from "umi";
import { extend } from "umi-request";
import { Notify } from "./common";

let SYSTEM_ERROR_MESSAGE = "服务器连接异常，请稍后重试!"
let isNotifyShowing = false;
const showSingleError = (message: string) => {
  if (!isNotifyShowing) {
    isNotifyShowing = true;
    Notify.fail(message);
    // 2秒后重置状态，允许下一次报错
    setTimeout(() => {
      isNotifyShowing = false;
    }, 2000);
  }
};
const request = extend({
  prefix: "/steins",
  timeout: 300000,
  errorHandler: (error) => {
    const {response} = error
    if (response && response.status) {
      showSingleError(SYSTEM_ERROR_MESSAGE);

    }
    throw error;
  },
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem("token");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: token,
    };
  }
  return { url, options };
});

// 响应拦截器
request.interceptors.response.use(async (response) => {
  const contentType = response.headers.get("Content-Type");
  // 处理文件下载响应
  if (
    contentType &&
    (contentType.includes("application/octet-stream") ||
      contentType.includes("application/vnd.ms-excel") ||
      contentType.includes("application/pdf") ||
      contentType.includes("image/"))
  ) {
    return {
      code: 200,
      data: await response.blob(),
      msg: "成功",
    };
  }
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (data.code === 401) {
      Notify.fail(data.msg || "");
      localStorage.removeItem("token");
      umiHistory.push(SIGN_IN);
      return data;
    }
    if (data.code === 500) {
      showSingleError(SYSTEM_ERROR_MESSAGE)
    }
    return data;
  }

  return response;
});

export default request;
