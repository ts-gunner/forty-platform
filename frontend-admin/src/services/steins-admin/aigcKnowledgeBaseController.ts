// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 创建文件夹 POST /aigc/knowledgeBase/createFolder */
export async function createFolder(
  body: API.AigcCreateFolderRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultSysFolderVo>("/aigc/knowledgeBase/createFolder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户创建KB知识库 POST /aigc/knowledgeBase/createKnowledgeBase */
export async function createKnowledgeBase(
  body: API.CreateKnowledgeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAigcKnowledgeBaseVo>(
    "/aigc/knowledgeBase/createKnowledgeBase",
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

/** 删除文件夹 DELETE /aigc/knowledgeBase/deleteFolder/${param0} */
export async function deleteFolder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFolderParams,
  options?: { [key: string]: any }
) {
  const { folderId: param0, ...queryParams } = params;
  return request<API.ApiResultBoolean>(
    `/aigc/knowledgeBase/deleteFolder/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 查询商业数据库 POST /aigc/knowledgeBase/getCommercialDataPage */
export async function getCommercialDataPage(
  body: API.GetKnowledgeBasePageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcKnowledgeBasePageVo>(
    "/aigc/knowledgeBase/getCommercialDataPage",
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

/** 查询商业知识库 POST /aigc/knowledgeBase/getCommercialKnowledgePage */
export async function getCommercialKnowledgePage(
  body: API.GetKnowledgeBasePageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcKnowledgeBasePageVo>(
    "/aigc/knowledgeBase/getCommercialKnowledgePage",
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

/** 获取文件管理列表 通过文件夹ID POST /aigc/knowledgeBase/getFileManagerListByFolderId */
export async function getFileManagerListByFolderId(
  body: API.AigcGetFileManagerListRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAigcGetFileManagerListVo>(
    "/aigc/knowledgeBase/getFileManagerListByFolderId",
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

/** 查询KB知识库 POST /aigc/knowledgeBase/getKnowledgeBasePage */
export async function getPageByKnowledgeBase(
  body: API.GetKnowledgeBasePageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcKnowledgeBasePageVo>(
    "/aigc/knowledgeBase/getKnowledgeBasePage",
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

/** 查询个人数据库 POST /aigc/knowledgeBase/getPersonalDataPage */
export async function getPersonalDataPage(
  body: API.GetKnowledgeBasePageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcKnowledgeBasePageVo>(
    "/aigc/knowledgeBase/getPersonalDataPage",
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

/** 查询个人知识库 POST /aigc/knowledgeBase/getPersonalKnowledgePage */
export async function getPersonalKnowledgePage(
  body: API.GetKnowledgeBasePageRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcKnowledgeBasePageVo>(
    "/aigc/knowledgeBase/getPersonalKnowledgePage",
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

/** 根据agentKey获取根目录文件夹 GET /aigc/knowledgeBase/getRootFolderListByAgentKey */
export async function getRootFolderListByAgentKey(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRootFolderListByAgentKeyParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultListAigcReferFilterVo>(
    "/aigc/knowledgeBase/getRootFolderListByAgentKey",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 用户删除KB知识库 DELETE /aigc/knowledgeBase/removeKnowledgeBase/${param0} */
export async function removeKnowledgeBase(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeKnowledgeBaseParams,
  options?: { [key: string]: any }
) {
  const { knowledgeBaseId: param0, ...queryParams } = params;
  return request<API.ApiResultBoolean>(
    `/aigc/knowledgeBase/removeKnowledgeBase/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新KB知识库 POST /aigc/knowledgeBase/updateKnowledgeBase */
export async function updateKnowledgeBase(
  body: API.UpdateKnowledgeBaseRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAigcKnowledgeBaseVo>(
    "/aigc/knowledgeBase/updateKnowledgeBase",
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

/** 上传缩略图 POST /aigc/knowledgeBase/uploadPreviewImage */
export async function uploadPreviewImage(
  body: {},
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

  return request<API.ApiResultSysResourceVo>(
    "/aigc/knowledgeBase/uploadPreviewImage",
    {
      method: "POST",
      data: formData,
      requestType: "form",
      ...(options || {}),
    }
  );
}
