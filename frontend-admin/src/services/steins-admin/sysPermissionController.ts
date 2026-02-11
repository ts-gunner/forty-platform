// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 添加权限 POST /permission/add */
export async function addPermission(
  body: API.AddSysPermissionRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/permission/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除权限 DELETE /permission/delete */
export async function deletePermission(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePermissionParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/permission/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 权限列表 GET /permission/list */
export async function listPermissions(options?: { [key: string]: any }) {
  return request<API.ApiResultListSysPermissionVo>("/permission/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 权限分页查询列表（支持条件搜索） GET /permission/page */
export async function pagePermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pagePermissionsParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageSysPermissionVo>("/permission/page", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 更新权限 POST /permission/update */
export async function updatePermission(
  body: API.UpdateSysPermissionRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/permission/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
