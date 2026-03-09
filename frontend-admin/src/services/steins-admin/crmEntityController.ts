// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 创建客户实体 POST /crm/entity/create */
export async function createEntity(
  body: API.EntityCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/entity/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除客户实体 DELETE /crm/entity/delete */
export async function deleteEntity(
  body: API.EntityDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/entity/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取客户实体详情 GET /crm/entity/detail */
export async function getEntityDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEntityDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCrmCrmEntityVo>("/crm/entity/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取客户实体列表 GET /crm/entity/list */
export async function getEntityList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEntityListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultResponsePageResultCrmCrmEntityVo>(
    "/crm/entity/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 更新客户实体 PUT /crm/entity/update */
export async function updateEntity(
  body: API.EntityUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/entity/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
