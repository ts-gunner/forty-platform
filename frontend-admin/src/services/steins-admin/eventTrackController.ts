// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 统计埋点数据数量 根据条件统计埋点数据总数 GET /event-track/count */
export async function countEventTracks(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.countEventTracksParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultLong>("/event-track/count", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询用户行为埋点 支持多条件筛选查询埋点数据，包括：userId、eventName、module、actionGroup POST /event-track/page */
export async function pageEventTracks(
  body: API.EventTrackPageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageSysUserEvent>("/event-track/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 记录用户行为埋点 前端调用此接口记录用户行为事件 POST /event-track/record */
export async function recordEvent(
  body: API.EventTrackRecordRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/event-track/record", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
