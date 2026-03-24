import { CrmDataTypeEnum } from "@/constant/enums";
import { findSelectedNodes } from "@/utils/region";
import { Picker } from "@tarojs/components";
import { AtInput, AtListItem, AtTextarea } from "taro-ui";

export default function ValueBoxGenerator({
  field,
  value,
  onChange,
}: {
  field: API.CrmEntityFieldVo;
  [key: string]: any;
}) {
  const { dataType, fieldName, fieldKey, options } = field;

  switch (dataType) {
    case CrmDataTypeEnum.Number:
      return (
        <AtInput
          type="number"
          cursor={-1}
          name={fieldKey}
          title={fieldName}
          placeholder={"请输入" + fieldName}
          value={value}
          onChange={onChange}
        />
      );
    case CrmDataTypeEnum.TextArea:
      return (
        <AtTextarea
          className="bg-gray-50 border-none rounded-md"
          value={value}
          style={{
            margin: 0,
          }}
          onChange={onChange}
          maxLength={200}
          placeholder={"请输入" + fieldName}
        />
      );
    case CrmDataTypeEnum.Boolean:
      let booleanOptions = [
        {
          label: "是",
          value: true,
        },
        {
          label: "否",
          value: false,
        },
      ];
      let idx = booleanOptions.findIndex((it) => it.value === value);
      let previewValue = "";
      if (idx !== -1) {
        previewValue = booleanOptions[idx].label;
      }
      return (
        <Picker
          mode="selector"
          range={booleanOptions}
          rangeKey="label"
          onChange={(e: any) => {
            let idx = Number.parseInt(e.detail.value);
            onChange(booleanOptions[idx].value);
          }}
        >
          <AtListItem
            title={fieldName}
            extraText={previewValue || "请选择"}
            arrow="right"
          />
        </Picker>
      );
    case CrmDataTypeEnum.Picker:
      const selectOptions = options ? options.split(",") : [];
      return (
        <Picker
          value={value || "未选择"}
          onChange={(e: any) => {
            let idx = Number.parseInt(e.detail.value);
            onChange(selectOptions[idx]);
          }}
          range={selectOptions}
        >
          <AtListItem
            title={fieldName}
            extraText={value || "请选择"}
            arrow="right"
          />
        </Picker>
      );
    case CrmDataTypeEnum.Date:
      return (
        <Picker
          mode="date"
          value={value}
          onChange={(e: any) => {
            onChange(e.target.value);
          }}
        >
          <AtListItem
            title={fieldName}
            extraText={value || "请选择"}
            arrow="right"
          />
        </Picker>
      );
    case CrmDataTypeEnum.Region:
      let regionValue = "";
      if (value) {
        regionValue = findSelectedNodes(value);
      }
      return (
        <Picker
          mode="region"
          value={value}
          onChange={(e: any) => {
            let changeValues = e.target.code.map((it: string) => {
              return it.replace(/0+$/, "");
            });
            onChange(changeValues.join(","));
          }}
        >
          <AtListItem
            title={fieldName}
            note={regionValue || "请选择"}
            arrow="right"
          />
        </Picker>
      );
    default:
      return (
        <AtInput
          cursor={-1}
          name={fieldKey}
          title={fieldName}
          placeholder={"请输入" + fieldName}
          value={value}
          onChange={onChange}
        />
      );
  }
}
