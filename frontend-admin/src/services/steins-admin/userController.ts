// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 创建用户 POST /system/user/create */
export async function createUser(
  body: API.UserCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /system/user/delete */
export async function deleteUser(
  body: API.UserDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/user/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户详情 GET /system/user/detail */
export async function getUserDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultSystemUserVo>("/system/user/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户列表 GET /system/user/list */
export async function getUserList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultResponsePageResultSystemUserVo>(
    "/system/user/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 重置密码 PUT /system/user/resetPwd */
export async function updatePassword(
  body: API.UserResetPwdRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/user/resetPwd", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户 PUT /system/user/update */
export async function updateUser(
  body: API.UserUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
