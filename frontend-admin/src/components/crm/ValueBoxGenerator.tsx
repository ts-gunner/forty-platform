import { CrmDataTypeEnum } from "@/constants/enums";
import { regionOptions } from "@/utils/region";
import { Cascader, DatePicker, Input, InputNumber, Select, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function ValueBoxGenerator({ field, value, onChange }: { field: API.CrmEntityFieldVo; [key: string]: any }) {
  const { dataType, fieldName, options } = field;
  let selectOptions = options ? options.split(",") : [];
  switch (dataType) {
    case CrmDataTypeEnum.Number:
      return <InputNumber value={value} onChange={onChange} className="w-full" placeholder={`请输入${fieldName}`} />;
    case CrmDataTypeEnum.Boolean:
      return (
        <Select
          value={value != null ? value : "未选择"}
          allowClear
          onChange={onChange}
          placeholder={`请选择${fieldName}`}
          options={[
            {
              label: "是",
              value: true,
            },
            {
              label: "否",
              value: false,
            },
          ]}
        ></Select>
      );
    case CrmDataTypeEnum.Picker:
      return (
        <Select
          value={value || "未选择"}
          allowClear
          onChange={onChange}
          placeholder={`请选择${fieldName}`}
          options={selectOptions.map((opt: any) => ({
            label: opt,
            value: opt,
          }))}
        ></Select>
      );
    case CrmDataTypeEnum.PickerOrOther:
      return (
        <Select
          mode="tags"
          maxCount={1}
          value={value ? [value] : []}
          allowClear
          onChange={(val) => {
            if (val.length > 0) {
              onChange(val[0]);
            } else {
              onChange("");
            }
          }}
          placeholder={`请选择${fieldName}`}
          options={selectOptions.map((opt: any) => ({
            label: opt,
            value: opt,
          }))}
        ></Select>
      );
    case CrmDataTypeEnum.Location:
      return <Location value={value} onChange={onChange} />;
    case CrmDataTypeEnum.Date:
      const dateValue = value ? dayjs(value) : undefined;
      return (
        <DatePicker
          value={dateValue}
          onChange={(val) => {
            onChange(val?.format("YYYY-MM-DD"));
          }}
          className="w-full"
          format={"YYYY-MM-DD"}
        />
      );
    case CrmDataTypeEnum.Region:
      return (
        <Cascader
          value={value ? value.split(",") : []}
          options={regionOptions}
          onChange={(val) => {
            onChange(val.join(","));
          }}
          placeholder="请选择省市区"
          showSearch
        />
      );
    default:
      return <Input value={value} onChange={onChange} placeholder={`请输入${fieldName}`} />;
  }
}

const Location: React.FC<{
  value: any;
  onChange: any;
}> = ({ value, onChange }) => {
  const [locationValue, setLocationValue] = useState<any>(undefined);
  useEffect(() => {
    try {
      const loc = JSON.parse(value);
      setLocationValue(loc);
    } catch {}
  }, [value]);
  return (
    <div className="flex items-center">
      <Space.Compact>
        <Tooltip title="纬度">
          <Input
            type="number"
            value={locationValue?.latitude}
            onChange={(e) => {
              onChange(
                JSON.stringify({
                  ...locationValue,
                  latitude: parseFloat(e.target.value),
                }),
              );
            }}
          />
        </Tooltip>
        <Tooltip title="经度">
          <Input
            type="number"
            value={locationValue?.longitude}
            onChange={(e) => {
              onChange(
                JSON.stringify({
                  ...locationValue,
                  longitude: parseFloat(e.target.value),
                }),
              );
            }}
          />
        </Tooltip>
        <Tooltip title="地址">
          <Input
            value={locationValue?.address}
            onChange={(e) => {
              onChange(
                JSON.stringify({
                  ...locationValue,
                  address: e.target.value,
                }),
              );
            }}
          />
        </Tooltip>
      </Space.Compact>
    </div>
  );
};
