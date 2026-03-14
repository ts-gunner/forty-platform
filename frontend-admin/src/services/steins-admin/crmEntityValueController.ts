// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 删除实体数据 POST /crm/value/delete */
export async function deleteEntityValue(
  body: API.DeleteCrmEntityValueRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/value/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 插入实体数据 POST /crm/value/insert */
export async function insertEntityValue(
  body: API.InsertCrmEntityValueRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/value/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取对应的实体表数据 GET /crm/value/list */
export async function getEntityValueList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEntityValueListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCrmCrmEntityValueObjectVo>("/crm/value/list", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新实体数据 POST /crm/value/update */
export async function updateEntityValue(
  body: API.UpdateCrmEntityValueRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/value/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
