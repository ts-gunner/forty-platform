// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 新增文章 POST /cms/article/add */
export async function addArticle(
  body: API.AddCmsArticleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/article/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 文章上架/下架 POST /cms/article/change-status */
export async function changeStatus(
  body: API.CmsChangeStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/article/change-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除文章 DELETE /cms/article/delete */
export async function deleteArticle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteArticleParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/article/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除文章图片 DELETE /cms/article/delete-image/${param0} */
export async function deleteImage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteImageParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<API.ApiResultBoolean>(`/cms/article/delete-image/${param0}`, {
    method: "DELETE",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取文章详情 GET /cms/article/detail/${param0} */
export async function getArticleDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleDetailParams,
  options?: { [key: string]: any }
) {
  const { articleId: param0, ...queryParams } = params;
  return request<API.ApiResultCmsArticleDetailVo>(
    `/cms/article/detail/${param0}`,
    {
      method: "GET",
      params: {
        // incrementView has a default value: true
        incrementView: "true",
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 查询文章已上传的图片列表 GET /cms/article/images/${param0} */
export async function getArticleImages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleImagesParams,
  options?: { [key: string]: any }
) {
  const { articleId: param0, ...queryParams } = params;
  return request<API.ApiResultListCmsFileVo>(`/cms/article/images/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 点赞文章 POST /cms/article/like */
export async function likeArticle(
  body: API.LikeArticleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/article/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页查询文章 GET /cms/article/page */
export async function pageArticle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageArticleParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageCmsArticleVo>("/cms/article/page", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 分页查询发布文章（客户端） GET /cms/article/pageArticle */
export async function pageArticleClient(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageArticleClientParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageCmsArticleClientVo>(
    "/cms/article/pageArticle",
    {
      method: "GET",
      params: {
        ...params,
        request: undefined,
        ...params["request"],
      },
      ...(options || {}),
    }
  );
}

/** 获取图片预览URL GET /cms/article/preview-url/${param0} */
export async function getPreviewUrl1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPreviewUrl1Params,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<API.ApiResultString>(`/cms/article/preview-url/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 文章置顶/取消置顶 POST /cms/article/toggle-top */
export async function toggleTop(
  body: API.CmsToggleTopRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/article/toggle-top", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 取消点赞 POST /cms/article/unlike */
export async function unlikeArticle(
  body: API.LikeArticleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/article/unlike", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新文章 POST /cms/article/update */
export async function updateArticle(
  body: API.UpdateCmsArticleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/cms/article/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新文章封面图 POST /cms/article/update-cover */
export async function updateCover(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCoverParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCmsUploadFileVo>("/cms/article/update-cover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 上传封面图 POST /cms/article/upload-cover */
export async function uploadCover(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadCoverParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCmsUploadFileVo>("/cms/article/upload-cover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 上传文章内容文件（图片为主） POST /cms/article/upload-file */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadFileParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCmsUploadFileVo>("/cms/article/upload-file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
