// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 添加实体表字段 POST /crm/field/addEntityField */
export async function addEntityField(
  body: API.AddCrmEntityFieldRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/field/addEntityField", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除实体表字段 POST /crm/field/deleteEntityField */
export async function deleteEntityField(
  body: API.DeleteCrmEntityFieldRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/field/deleteEntityField", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据实体表id获取实体表字段 GET /crm/field/getFieldsByEntityId */
export async function getFieldsByEntityId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFieldsByEntityIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultArrayCrmCrmEntityFieldVo>(
    "/crm/field/getFieldsByEntityId",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 更新实体表字段 POST /crm/field/updateEntityField */
export async function updateEntityField(
  body: API.UpdateCrmEntityFieldRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/field/updateEntityField", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
