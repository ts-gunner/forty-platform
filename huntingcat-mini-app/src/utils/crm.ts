import { CrmDataTypeEnum } from "@/constant/enums";
import { findSelectedNodes } from "./region";

export const handleCrmValueByFieldKey = (
  fields: API.CrmEntityFieldVo[],
  fieldKey: string,
  data: any
) => {
  return handleCrmValueByField(findFieldByFieldKey(fields, fieldKey), data)
}
export const handleCrmValueByField = (
  field: API.CrmEntityFieldVo,
  data: any,
) => {
  if (!field) {
    return "unknown";
  }
  if (!field.fieldKey) {
    return "-";
  }
  switch (field.dataType) {
    case CrmDataTypeEnum.Boolean:
      return data?.[field.fieldKey] === true ? "是" : "否";
    case CrmDataTypeEnum.Region:
      return findSelectedNodes(data?.[field.fieldKey]);
    case CrmDataTypeEnum.Location:
      let addr = "";
      try {
        let loc = JSON.parse(data?.[field.fieldKey]);
        addr = loc?.address;
      } catch {
        addr = data?.[field.fieldKey];
      }
      return addr;
    default:
      return data?.[field.fieldKey];
  }
};

export const findFieldByFieldKey = (
  fields: API.CrmEntityFieldVo[],
  fieldKey: string,
) => {
  if (fields === undefined) {
    return null;
  }
  return fields.find((it) => it.fieldKey === fieldKey);
};
