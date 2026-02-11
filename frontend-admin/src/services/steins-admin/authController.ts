// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 用户登录 POST /auth/doLogin */
export async function doLogin(
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultUserLoginVo>("/auth/doLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 强制注销，需要管理员权限 POST /auth/forceLogout */
export async function forceLogout(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.forceLogoutParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultVoid>("/auth/forceLogout", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户登录状态信息 GET /auth/getUserInfo */
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.ApiResultUserLoginVo>("/auth/getUserInfo", {
    method: "GET",
    ...(options || {}),
  });
}

/** 用户登出 POST /auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.ApiResultVoid>("/auth/logout", {
    method: "POST",
    ...(options || {}),
  });
}
