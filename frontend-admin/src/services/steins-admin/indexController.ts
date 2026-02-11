// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 此处后端没有提供注释 GET /app_info */
export async function getAppInfo(options?: { [key: string]: any }) {
  return request<API.ApiResultMapStringString>("/app_info", {
    method: "GET",
    ...(options || {}),
  });
}
