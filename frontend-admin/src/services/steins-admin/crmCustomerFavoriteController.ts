// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 添加收藏 POST /crm/favorite/add */
export async function addCustomerFavorite(
  body: API.AddCustomerFavoriteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/favorite/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 取消收藏 POST /crm/favorite/remove */
export async function removeCustomerFavorite(
  body: API.RemoveCustomerFavoriteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/favorite/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取收藏列表 GET /crm/favorite/list */
export async function getCustomerFavoriteList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCustomerFavoriteListParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultResponsePageResultCrmCrmCustomerFavoriteVo>("/crm/favorite/list", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 检查是否已收藏 GET /crm/favorite/check */
export async function checkCustomerFavorite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkCustomerFavoriteParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/crm/favorite/check", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
