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

/** 获取当前登录用户 GET /system/auth/getCurrentUser */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.ApiResultSystemLoginUserVo>(
    "/system/auth/getCurrentUser",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 微信小程序客户系统一键登录 POST /system/auth/wechatCrmLogin */
export async function wechatCrmLogin(
  body: API.WechatCodeLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultString>("/system/auth/wechatCrmLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
