// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 单文件预处理 对单个文件进行预处理操作 POST /aigc/fileProcessing/predata/file */
export async function predataFile(
  body: {
    request: API.PredataFileRequest;
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

  return request<API.ApiResultString>("/aigc/fileProcessing/predata/file", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
}

/** 多文件预处理 对多个文件进行批量预处理操作 POST /aigc/fileProcessing/predata/files */
export async function predataFiles(
  body: {
    request: API.PredataFileRequest;
  },
  files?: File[],
  options?: { [key: string]: any }
) {
  const formData = new FormData();

  if (files) {
    files.forEach((f) => formData.append("files", f || ""));
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

  return request<API.ApiResultString>("/aigc/fileProcessing/predata/files", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
}

/** 手动触发轮询 手动触发向量化任务状态检查 GET /aigc/fileProcessing/vector/check_status */
export async function manualCheckStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.manualCheckStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultString>(
    "/aigc/fileProcessing/vector/check_status",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 查询任务状态 根据任务ID列表查询向量化任务状态 POST /aigc/fileProcessing/vector/task_status */
export async function getTaskStatus(
  body: API.TaskSelectRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultListTaskStatusRecordVO>(
    "/aigc/fileProcessing/vector/task_status",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 文件向量化 上传文件并进行向量化处理 POST /aigc/fileProcessing/vectorize */
export async function vectorizeFile(
  body: {
    request: API.VectorizeFileRequest;
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

  return request<API.ApiResultString>("/aigc/fileProcessing/vectorize", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
}
