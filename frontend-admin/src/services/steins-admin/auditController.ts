// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 查询审核记录详情 GET /audit/getAuditDetail */
export async function getAuditDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAuditDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/audit/getAuditDetail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询审核记录列表 GET /audit/getAuditList */
export async function getAuditList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAuditListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/audit/getAuditList", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 审核或驳回 POST /audit/updateAudit */
export async function updateAudit(
  body: API.UpdateAuditRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/audit/updateAudit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
