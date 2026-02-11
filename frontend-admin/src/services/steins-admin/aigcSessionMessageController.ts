// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 获取会话消息 POST /aigc/sessionMessage/getMessageById */
export async function getMessageById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMessageByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAigcSessionMessageVo>(
    "/aigc/sessionMessage/getMessageById",
    {
      method: "POST",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 根据sessionId获取会话消息 POST /aigc/sessionMessage/getMessagesBySessionId */
export async function getMessagesBySessionId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMessagesBySessionIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultMapStringString>(
    "/aigc/sessionMessage/getMessagesBySessionId",
    {
      method: "POST",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 保存会话消息 POST /aigc/sessionMessage/saveMessage */
export async function saveMessage(
  body: API.AigcSessionMessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAigcSessionMessageVo>(
    "/aigc/sessionMessage/saveMessage",
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
