import Taro from "@tarojs/taro";

interface ResponseError<D = any> extends Error {
  name: string;
}
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
/**
 * 增加的参数
 * @param {string} requestType post类型, 用来简化写content-Type, 默认json
 * @param {*} data post数据
 * @param {object} params query参数
 * @param {string} responseType 服务端返回的数据类型, 用来解析数据, 默认json
 * @param {number} timeout 超时时长, 默认未设, 单位毫秒
 * @param {function} errorHandler 错误处理
 * @param {string} prefix 前缀
 * @param {string} charset 字符集, 默认utf8
 */
interface RequestOptions {
  requestType?: "json" | "form";
  method?: RequestMethod;
  headers?: Record<string, any>;
  data?: any;
  params?: object | URLSearchParams;
  prefix?: string;
  timeout?: number;
  errorHandler?: (error: ResponseError) => void;
  [key: string]: any;
}

interface RequestFunc {
  <T = any>(url: string, options: RequestOptions): Promise<T>;
}

interface Extend {
  (options: RequestOptions): RequestFunc;
}

export const extend: Extend = (initialOptions: RequestOptions): RequestFunc => {
    const request = async <T>(url: string, options: RequestOptions): Promise<T> => {
    let finalOptions = {
      ...initialOptions,
      ...options,
    };
    let requestMethod = finalOptions?.method || "GET"
    let requestBody = {}
    if (requestMethod === "GET") {
      requestBody = finalOptions?.params
    }else if (requestMethod === "POST") {
      requestBody = finalOptions?.data
    }
    let response = await Taro.request({
      url: (finalOptions?.prefix || "") + url,
      method: requestMethod,
      header: finalOptions?.headers,
      data: requestBody,
      enableHttp2: true,
    })
    return response.data as T;
  };

  let requestFunc = request as RequestFunc
  // requestFunc.interceptors.request.use = (handler) => {

  // }
  // requestFunc.interceptors.response.use = (handler) => {
    
  // }

  return requestFunc
};
