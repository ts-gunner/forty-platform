// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 重定向访问对象存储资源url GET /system/resource/access/${param0} */
export async function accessResource(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.accessResourceParams,
  options?: { [key: string]: any }
) {
  const { resourceId: param0, ...queryParams } = params;
  return request<any>(`/system/resource/access/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除资源 DELETE /system/resource/delete */
export async function deleteResource(
  body: API.DeleteResourceRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/system/resource/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 上传资源 POST /system/resource/upload */
export async function uploadResource(
  body: {
    /** resource type */
    resourceType: number;
  },
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === "object" && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ""));
        } else {
          formData.append(
            ele,
            new Blob([JSON.stringify(item)], { type: "application/json" })
          );
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.ApiResultSystemSysResourceVo>("/system/resource/upload", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
}
