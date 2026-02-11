// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 获取资源信息 GET /file/resource/${param0} */
export async function getInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInfoParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<API.ApiResultSysResource>(`/file/resource/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取下载链接 GET /file/resource/download-url/${param0} */
export async function getDownloadUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDownloadUrlParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<API.ApiResultString>(`/file/resource/download-url/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 下载文件(流式) GET /file/resource/download/${param0} */
export async function download(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.downloadParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<any>(`/file/resource/download/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 文件分页列表 GET /file/resource/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageSysResource>("/file/resource/page", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 获取预览链接 GET /file/resource/preview-url/${param0} */
export async function getPreviewUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPreviewUrlParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<API.ApiResultString>(`/file/resource/preview-url/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 预览文件(流式) GET /file/resource/preview/${param0} */
export async function preview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.previewParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<any>(`/file/resource/preview/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除文件 DELETE /file/resource/remove/${param0} */
export async function remove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<API.ApiResultBoolean>(`/file/resource/remove/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}
