// @ts-ignore
/* eslint-disable */
import request from "@/utils/admin_request";

/** 运营人员创建问题示例 POST /aigc/questionExample/createQuestion */
export async function createQuestionExample(
  body: API.AddQuestionExampleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultAigcQuestionExampleVo>(
    "/aigc/questionExample/createQuestion",
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

/** 运营人员查看问题示例页 POST /aigc/questionExample/getPageByQuestion */
export async function getPageByQuestionExample(
  body: API.GetPageQuestionExampleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultPageAigcQuestionExampleVo>(
    "/aigc/questionExample/getPageByQuestion",
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

/** 产品端 - 查看问题示例 GET /aigc/questionExample/getQuestionExample */
export async function getQuestionExample(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionExampleParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultListAigcQuestionExampleVo>(
    "/aigc/questionExample/getQuestionExample",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 运营人员删除问题示例 DELETE /aigc/questionExample/removeQuestion/${param0} */
export async function removeQuestionExample(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeQuestionExampleParams,
  options?: { [key: string]: any }
) {
  const { questionId: param0, ...queryParams } = params;
  return request<API.ApiResultBoolean>(
    `/aigc/questionExample/removeQuestion/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 运营人员修改问题示例 POST /aigc/questionExample/updateQuestion */
export async function updateQuestionExample(
  body: API.UpdateQuestionExampleRequest,
  options?: { [key: string]: any }
) {
  return request<API.ApiResultBoolean>("/aigc/questionExample/updateQuestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
