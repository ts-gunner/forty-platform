import { CrmDataTypeEnum } from "@/constant/enums";
import { findSelectedNodes } from "./region";
import { handleCrmValueByField } from "@/components/crm/ValueBoxGenerator";

export const handleCrmValueByFieldKey = (
  fields: API.CrmEntityFieldVo[],
  fieldKey: string,
  data: any
) => {
  return handleCrmValueByField(findFieldByFieldKey(fields, fieldKey), data)
}

export const findFieldByFieldKey = (
  fields: API.CrmEntityFieldVo[],
  fieldKey: string,
) => {
  if (fields === undefined) {
    return null;
  }
  return fields.find((it) => it.fieldKey === fieldKey);
};
