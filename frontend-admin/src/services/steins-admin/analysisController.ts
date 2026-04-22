// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 获取基础数据指标值 获取业务员总数，客户总数 GET /analysis/statistics/getBasicCount */
export async function getBasicCount(options?: { [key: string]: any }) {
  return request<API.ApiResultAnalysisBasicIndicator>(
    "/analysis/statistics/getBasicCount",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 获取客户数据跟业务员的相关指标值 GET /analysis/statistics/getCustomerCountByUser */
export async function getCustomerCountByUser(options?: { [key: string]: any }) {
  return request<API.ApiResultArrayAnalysisCustomerIndicator>(
    "/analysis/statistics/getCustomerCountByUser",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
