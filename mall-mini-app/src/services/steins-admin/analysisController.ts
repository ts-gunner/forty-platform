// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 获取基础数据指标值 获取业务员总数，客户总数 GET /analysis/analysis/getBasicCount */
export async function getBasicCount(options?: { [key: string]: any }) {
  return request<API.ApiResultAnalysisBasicIndicator>(
    "/analysis/analysis/getBasicCount",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 获取客户数据跟业务员的相关指标值 GET /analysis/analysis/getCustomerCountByUser */
export async function getCustomerCountByUser(options?: { [key: string]: any }) {
  return request<API.ApiResultArrayAnalysisCustomerIndicator>(
    "/analysis/analysis/getCustomerCountByUser",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 获取客户总数趋势图 GET /analysis/analysis/getCustomerTrendChart */
export async function getCustomerTrendChart(options?: { [key: string]: any }) {
  return request<API.ApiResultArrayAnalysisCustomerTrendChart>(
    "/analysis/analysis/getCustomerTrendChart",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 根据用户id获取客户总数趋势图 GET /analysis/analysis/getCustomerTrendChartByUserId */
export async function getCustomerTrendChartByUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCustomerTrendChartByUserIdParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultArrayAnalysisCustomerTrendChart>(
    "/analysis/analysis/getCustomerTrendChartByUserId",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
