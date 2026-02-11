// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 添加角色 POST /role/add */
export async function addRole(
  body: API.AddSysRoleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/role/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 设置角色的权限列表 POST /role/bindPermissions */
export async function bindPermissions(
  body: API.RolePermissionBindRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/role/bindPermissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 DELETE /role/delete */
export async function deleteRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRoleParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/role/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 角色列表 GET /role/list */
export async function listRoles(options?: { [key: string]: any }) {
  return request<API.ApiResultListSysRoleVo>("/role/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 角色分页查询列表（支持条件搜索） GET /role/page */
export async function pageRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageRolesParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageSysRoleVo>("/role/page", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 查询角色绑定的权限列表（权限ID和权限标识） GET /role/permissionList */
export async function getRolePermissionList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolePermissionListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultListRolePermissionVo>("/role/permissionList", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 解绑角色权限 POST /role/unbindPermissions */
export async function unbindPermissions(
  body: API.RolePermissionUnbindRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/role/unbindPermissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新角色 POST /role/update */
export async function updateRole(
  body: API.UpdateSysRoleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/role/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
