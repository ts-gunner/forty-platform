// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 添加用户账号 POST /user/add */
export async function addSystemUser(
  body: API.AddSysUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 为用户分配角色 POST /user/bindRoles */
export async function bindRoles(
  body: API.UserRoleBindRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/user/bindRoles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户账号 DELETE /user/delete */
export async function deleteSystemUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteSystemUserParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/user/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户个人详情信息 GET /user/getDetail */
export async function getUserDetail(options?: { [key: string]: any }) {
  return request<API.ApiResultUserDetailVo>("/user/getDetail", {
    method: "GET",
    ...(options || {}),
  });
}

/** 用户分页查询列表（支持条件搜索） POST /user/page */
export async function pageUsers(
  body: API.UserPageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageSysUserVo>("/user/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询用户拥有的权限列表（权限ID和权限标识） GET /user/permissions */
export async function getUserPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserPermissionsParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultListString>("/user/permissions", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 产品端 - 用户重置密码 POST /user/resetUserPassword */
export async function resetUserPassword(
  body: API.ResetUserPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/user/resetUserPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询用户拥有的角色列表（角色ID和角色标识） GET /user/roleList */
export async function getUserRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserRolesParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultListString>("/user/roleList", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 解绑用户角色 POST /user/unbindRoles */
export async function unbindRoles(
  body: API.UserRoleUnbindRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/user/unbindRoles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户信息 POST /user/update */
export async function updateSystemUser(
  body: API.UpdateSysUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
