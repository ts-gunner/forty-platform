// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 上传资源文件 POST /system/resource/upload */
export async function uploadResource(
  body: {
    /** 资源类型 */
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

  return request<API.ApiResultAny>("/system/resource/upload", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
}
