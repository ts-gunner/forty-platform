import { CrmDataTypeEnum } from "@/constant/enums";
import { findSelectedNodes } from "./region";

export const handleCrmValueByField = (field: API.CrmEntityFieldVo, data: any) => {
  if (!field) {
    return "unknown"
  }
  if (!field.fieldKey) {
    return "-";
  }
  switch (field.dataType) {
    case CrmDataTypeEnum.Boolean:
      return data?.[field.fieldKey] === true ? "是" : "否";
    case CrmDataTypeEnum.Region:
      return findSelectedNodes(data?.[field.fieldKey])
    default:
      return data?.[field.fieldKey];
  }
};


export const findFieldByFieldKey = (fields: API.CrmEntityFieldVo[], fieldKey: string) => {
  if (fields === undefined) {
    return null
  }
  return fields.find(it => it.fieldKey === fieldKey)
}