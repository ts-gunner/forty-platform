// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 此处后端没有提供注释 POST /aigc/callAgent */
export async function callAgent(
  body: API.CallAgentRequest,
  options?: { [key: string]: any }
) {
  return request<API.ServerSentEventString[]>("/aigc/callAgent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
