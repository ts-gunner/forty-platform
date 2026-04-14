// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 查询审核记录列表 GET /audit/review/getAuditList */
export async function getAuditList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAuditListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultResponsePageResultAuditAuditAccessRecordVo>(
    "/audit/review/getAuditList",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 审核或驳回 POST /audit/review/updateAudit */
export async function updateAudit(
  body: API.UpdateAuditRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/audit/review/updateAudit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
