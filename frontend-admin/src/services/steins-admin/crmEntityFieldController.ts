// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

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

/** 更新实体表所有字段 POST /crm/field/upsertEntityField */
export async function upsertEntityField(
  body: API.UpsertCrmEntityFieldRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/field/upsertEntityField", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
