// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 运营端账号密码登录 POST /system/auth/adminPwdLogin */
export async function adminPwdLogin(
  body: API.PwdLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultString>("/system/auth/adminPwdLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 运营端获取当前用户 GET /system/auth/getCurrentUser */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.ApiResultSystemAdminLoginUserVo>(
    "/system/auth/getCurrentUser",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
