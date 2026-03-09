// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 为角色分配权限 POST /system/rolePermissionRel/assign */
export async function assignPermissionsToRole(
  body: API.RolePermissionRelAssignRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/rolePermissionRel/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据权限ID获取角色列表 GET /system/rolePermissionRel/listByPermission */
export async function getRolesByPermissionId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesByPermissionIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultArraySystemRoleWithPermissionVo>(
    "/system/rolePermissionRel/listByPermission",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 根据角色ID获取权限列表 GET /system/rolePermissionRel/listByRole */
export async function getPermissionsByRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPermissionsByRoleIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultArraySystemRolePermissionRelVo>(
    "/system/rolePermissionRel/listByRole",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 移除角色的权限 DELETE /system/rolePermissionRel/remove */
export async function removePermissionFromRole(
  body: API.RolePermissionRelRemoveRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/rolePermissionRel/remove", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
