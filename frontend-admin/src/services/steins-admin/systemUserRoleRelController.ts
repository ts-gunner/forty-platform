// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 为用户分配角色 POST /system/userRoleRel/assign */
export async function assignRolesToUser(
  body: API.UserRoleRelAssignRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/userRoleRel/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据角色ID获取用户列表 GET /system/userRoleRel/listByRole */
export async function getUsersByRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersByRoleIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultArraySystemUserWithRoleVo>(
    "/system/userRoleRel/listByRole",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 根据用户ID获取角色列表 GET /system/userRoleRel/listByUser */
export async function getRolesByUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesByUserIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultArraySystemUserRoleRelVo>(
    "/system/userRoleRel/listByUser",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 移除用户的角色 DELETE /system/userRoleRel/remove */
export async function removeRoleFromUser(
  body: API.UserRoleRelRemoveRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/userRoleRel/remove", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
