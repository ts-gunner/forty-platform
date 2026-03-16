import { CrmDataTypeEnum } from "@/constants/enums";
import { ProColumns } from "@ant-design/pro-table";

export const generateCrmValueColumns = (entityFields: API.CrmEntityFieldVo[]): ProColumns[] => {
  return entityFields.map((it) => handleCrmValueColumn(it));
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
        key: fieldKey,
        align: "center",
      };
  }
};
