// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 审计-私有知识库 GET /aigc/audit/personalKB */
export async function personalKb(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.personalKBParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcKnowledgeBaseAndDatabasePageVo>(
    "/aigc/audit/personalKB",
    {
      method: "GET",
      params: {
        ...params,
        request: undefined,
        ...params["request"],
      },
      ...(options || {}),
    }
  );
}
