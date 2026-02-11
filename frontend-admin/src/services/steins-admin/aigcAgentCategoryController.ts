// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 添加分类 POST /aigc/category/add */
export async function addCategory(
  body: API.AddAigcAgentCategoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/aigc/category/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除分类 DELETE /aigc/category/delete */
export async function deleteCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/aigc/category/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 列表查询 GET /aigc/category/list */
export async function listCategories(options?: { [key: string]: any }) {
  return request<API.ApiResultListAigcAgentCategoryVo>("/aigc/category/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 分类分页列表 GET /aigc/category/page */
export async function pageCategories(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageCategoriesParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcAgentCategoryVo>("/aigc/category/page", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 获取分类项配置（树结构） GET /aigc/category/tree */
export async function getAgentCategoryTree(options?: { [key: string]: any }) {
  return request<API.ApiResultListAigcAgentTreeVo>("/aigc/category/tree", {
    method: "GET",
    ...(options || {}),
  });
}

/** 更新分类 POST /aigc/category/update */
export async function updateCategory(
  body: API.UpdateAigcAgentCategoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/aigc/category/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
