// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 删除实体数据 POST /crm/value/delete */
export async function deleteEntityValue(
  body: API.DeleteCrmEntityValueRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/value/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取对应的实体数据明细 GET /crm/value/detail */
export async function getEntityValueDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEntityValueDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCrmCrmEntityValueVo>("/crm/value/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取CRM客户信息的统计数据 GET /crm/value/getCrmValueCount */
export async function getCrmValueCount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCrmValueCountParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCrmCrmValueCountVo>(
    "/crm/value/getCrmValueCount",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 插入实体数据 POST /crm/value/insert */
export async function insertEntityValue(
  body: API.InsertCrmEntityValueRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/value/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 客户端 - 获取对应的实体表数据 POST /crm/value/list */
export async function getEntityValueList(
  body: API.GetCrmEntityValueListRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCrmCrmEntityValueObjectVo>("/crm/value/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 运营端 - 获取对应的实体表数据 POST /crm/value/listByAdmin */
export async function getEntityValueListByAdmin(
  body: API.AdminGetCrmEntityValueListRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCrmCrmEntityValueObjectVo>(
    "/crm/value/listByAdmin",
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

/** 客户端 - 获取自己创建的客户信息 POST /crm/value/listBySelf */
export async function getEntityValueListBySelf(
  body: API.GetCrmEntityValueListRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultCrmCrmEntityValueObjectVo>(
    "/crm/value/listBySelf",
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

/** 更新实体数据 POST /crm/value/update */
export async function updateEntityValue(
  body: API.UpdateCrmEntityValueRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAny>("/crm/value/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 上传表格，添加客户数据 POST /crm/value/uploadCrmExcel */
export async function uploadCrmExcel(
  body: {
    /** 实体表id */
    entityId?: string;
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

  return request<API.ApiResultAny>("/crm/value/uploadCrmExcel", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
}
