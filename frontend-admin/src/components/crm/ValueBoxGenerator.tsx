import { CrmDataTypeEnum } from "@/constants/enums";
import { uploadResource } from "@/services/steins-admin/systemResourceController";
import { handleResponse } from "@/utils/common";
import { findSelectedNodes, regionOptions } from "@/utils/region";
import { Button, Cascader, DatePicker, Image, Input, InputNumber, Select, Space, Tooltip, Upload } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function ValueBoxGenerator({ field, value, onChange }: { field: API.CrmEntityFieldVo;[key: string]: any }) {
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
    case CrmDataTypeEnum.Resource:
      return value ? (
        <div className="flex items-center gap-3">
          <Image src={value} height={30}
            fallback="data:image/png;base64,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"
          />
          <Upload
            customRequest={async (options) => {
              const { file } = options
              const resp = await uploadResource({ resourceType: 2 }, file as File)
              handleResponse({
                resp,
                onSuccess: (data) => {
                  onChange(data.previewUrl)
                }
              })
            }}
            beforeUpload={() => {
              return true
            }}
            fileList={[]}
            showUploadList={false}>
            <Button>上传</Button>
          </Upload>
        </div>
      ) : (

        <Upload
          customRequest={async (options) => {
            const { file } = options
            const resp = await uploadResource({ resourceType: 2 }, file as File)
            handleResponse({
              resp,
              onSuccess: (data) => {
                onChange(data.previewUrl)
              }
            })
          }}
          beforeUpload={() => {
            return true
          }}
          fileList={[]}
          showUploadList={false}
        >
          <Button>上传</Button>
        </Upload>
      )
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
    } catch { }
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
    case CrmDataTypeEnum.Resource:
      return <Image src={data?.[field.fieldKey]} height={30}/>
    default:
      return data?.[field.fieldKey];
  }
};

