import Taro from "@tarojs/taro";
import storage from "./storage";
import { ApiResult } from "@/typing";

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
  return async <T>(
    url: string,
    options: RequestOptions,
  ): Promise<T> => {
    let finalOptions = {
      ...initialOptions,
      ...options,
    };
    let finalUrl = (finalOptions?.prefix || "") + url;
    console.log("finalUrl",finalUrl)
    let requestHeader = {
      ...finalOptions?.headers,
      Authorization: await storage.getItem("token"),
    };

    // 上传文件的方法
    if (
      finalOptions.data &&
      typeof finalOptions.data.getInternalData === "function"
    ) {
      const formData = finalOptions.data.getInternalData();
      let tempUrl = "";
      let fileKey = undefined;
      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === "object" && "uri" in value) {
          tempUrl = value.uri as string;
          fileKey = key;
        }
      });
      delete formData[fileKey];
      try {
        if (tempUrl) {
          const resp = await Taro.uploadFile({
            url: finalUrl,
            filePath: tempUrl,
            name: fileKey,
            header: requestHeader,
            formData: formData,
          });

          return JSON.parse(resp.data) as T;
        } else {
          let response = await Taro.request({
            url: finalUrl,
            method: "POST",
            header: requestHeader,
            data: formData,
          });
          return response.data as T;
        }
      } catch (err:any) {
        return {
          code: 500,
          msg: "服务异常:" + err.errMsg,
        } as T;
      }
    } else {
      // 常规上传
      let requestMethod = finalOptions?.method || "GET";
      let requestBody = {};
      if (requestMethod === "GET") {
        requestBody = finalOptions?.params;
      } else if (requestMethod === "POST") {
        requestBody = finalOptions?.data;
      }

      try {
        let response = await Taro.request({
          url: finalUrl,
          method: requestMethod,
          header: requestHeader,
          data: requestBody,
          enableHttp2: true,
        });
        return response.data as T;
      } catch (err:any) {
        return {
          code: 500,
          msg: "服务异常:" + err.errMsg,
        } as T;
      }
    }
  };
};
