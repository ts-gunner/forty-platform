// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 添加标签 POST /cms/tag/add */
export async function addTag(
  body: API.AddCmsTagRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/tag/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除标签 DELETE /cms/tag/delete */
export async function deleteTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTagParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/tag/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取标签详情（删除前调用该接口提示） GET /cms/tag/detail */
export async function getTagDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTagDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCmsTagDetailVo>("/cms/tag/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 标签列表 GET /cms/tag/list */
export async function listTags(options?: { [key: string]: any }) {
  return request<API.ApiResultListCmsTagVo>("/cms/tag/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 标签分页查询 GET /cms/tag/page */
export async function pageTags(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageTagsParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageCmsTagVo>("/cms/tag/page", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 标签分页查询（有关联文章数量） GET /cms/tag/pageWithCount */
export async function pageTagsWithCount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageTagsWithCountParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageCmsTagDetailVo>("/cms/tag/pageWithCount", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 更新标签 POST /cms/tag/update */
export async function updateTag(
  body: API.UpdateCmsTagRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/tag/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
