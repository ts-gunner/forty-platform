// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 创建权限 POST /system/permission/create */
export async function createPermission(
  body: API.PermissionCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/permission/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除权限 DELETE /system/permission/delete */
export async function deletePermission(
  body: API.PermissionDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/permission/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取权限详情 GET /system/permission/detail */
export async function getPermissionDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPermissionDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultSystemPermissionVo>("/system/permission/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取权限列表 GET /system/permission/list */
export async function getPermissionList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPermissionListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultResponsePageResultSystemPermissionVo>(
    "/system/permission/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 更新权限 PUT /system/permission/update */
export async function updatePermission(
  body: API.PermissionUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/permission/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
