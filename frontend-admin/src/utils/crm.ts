import { CrmDataTypeEnum } from "@/constants/enums";
import { ProColumns } from "@ant-design/pro-table";
import { findSelectedNodes } from "./region";



export const generateCrmValueColumns = (entityFields: API.CrmEntityFieldVo[]): ProColumns[] => {
  // 临时只展示5个字段
  return entityFields.slice(0, 5).map((it) => handleCrmValueColumn(it));
};

const handleCrmValueColumn = (field: API.CrmEntityFieldVo): ProColumns => {
  const { dataType, fieldName, options, fieldKey } = field;
  if (!fieldKey) {
    return {};
  }
  switch (dataType) {
    case CrmDataTypeEnum.Boolean:
      return {
        title: fieldName,
        dataIndex: fieldKey,
        key: fieldKey,
        hideInSearch: true,
        align: "center",
        render: (_, record: any) => {
          if (record[fieldKey] === true) {
            return "是";
          } else {
            return "否";
          }
        },
      };

    default:
      return {
        title: fieldName,
        dataIndex: fieldKey,
        hideInSearch: true,
        key: fieldKey,
        align: "center",
      };
  }
};

export const handleCrmValueByField = (field: API.CrmEntityFieldVo, data: any) => {
  if (!field.fieldKey) {
    return "-";
  }
  switch (field.dataType) {
    case CrmDataTypeEnum.Boolean:
      return data?.[field.fieldKey] === true ? "是" : "否";
    case CrmDataTypeEnum.Region:
      return findSelectedNodes(data?.[field.fieldKey])
    case CrmDataTypeEnum.Location:
      let addr = "";
      try {
        let loc = JSON.parse(data?.[field.fieldKey]);
        addr = loc?.address 
      } catch {
        addr = data?.[field.fieldKey];
      }
      return addr;
    default:
      return data?.[field.fieldKey];
  }
};

