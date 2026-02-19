// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 创建角色 POST /system/role/create */
export async function createRole(
  body: API.RoleCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/role/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 DELETE /system/role/delete */
export async function deleteRole(
  body: API.RoleDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/role/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取角色详情 GET /system/role/detail */
export async function getRoleDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultSystemRoleVo>("/system/role/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取角色列表 GET /system/role/list */
export async function getRoleList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultResponsePageResultSystemRoleVo>(
    "/system/role/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 更新角色 PUT /system/role/update */
export async function updateRole(
  body: API.RoleUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/role/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
