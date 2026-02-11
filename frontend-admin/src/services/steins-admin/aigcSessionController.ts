// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 清除用户会话数据 DELETE /aigc/session/clearChatSession */
export async function clearChatSession(options?: { [key: string]: any }) {
  return request<API.ApiResultBoolean>("/aigc/session/clearChatSession", {
    method: "DELETE",
    ...(options || {}),
  });
}

/** 用户创建会话 POST /aigc/session/createSession */
export async function createSession(
  body: API.AigcSessionRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAigcSessionVo>("/aigc/session/createSession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询用户会话数据 POST /aigc/session/getSessionsPage */
export async function getSessionsPage(
  body: API.GetSessionPageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcSessionVo>(
    "/aigc/session/getSessionsPage",
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

/** 删除指定会话数据 DELETE /aigc/session/removeChatSession */
export async function removeChatSession(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeChatSessionParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/aigc/session/removeChatSession", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
