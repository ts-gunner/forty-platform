// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 获取用户对话列表（运营端） POST /aigc/admin/session/getUserList */
export async function getUserList(
  body: API.GetUserConversationListRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageUserConversationVo>(
    "/aigc/admin/session/getUserList",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
