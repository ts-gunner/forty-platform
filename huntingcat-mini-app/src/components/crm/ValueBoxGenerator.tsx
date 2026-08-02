import { CrmDataTypeEnum } from "@/constant/enums";
import { uploadResource } from "@/services/steins-admin/systemResourceController";
import { handleResponse, Notify } from "@/utils/common";
import { findSelectedNodes } from "@/utils/region";
import { Button, Image, Input, Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { AtIcon, AtInput, AtListItem, AtTextarea } from "taro-ui";
import "./ValueBoxGenerator.scss";
const DEFAULT_IMAGE_BASE64 = 'data:image/png;base64,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';
export default function ValueBoxGenerator({
  field,
  value,
  onChange,
}: {
  field: API.CrmEntityFieldVo;
  [key: string]: any;
}) {
  const { dataType, fieldName, fieldKey, options, isRequired } = field;
  const selectOptions = options ? options.split(",") : [];
  const handleChooseAndUpload = (onChange: (val: any) => void) => {
    Taro.chooseMessageFile({
      count: 1,
      type: "file",
      success: async (res) => {
        const tempFilePaths = res.tempFiles;
        const tempFile = tempFilePaths[0];
        const resp = await uploadResource(
          {
            resourceType: 2,
          },
          { uri: tempFile.path } as any,
        );
        handleResponse({
          resp,
          onSuccess: (data) => {
            onChange(data.previewUrl)
          },

        });
      },
    });
  }
  switch (dataType) {
    case CrmDataTypeEnum.Number:
      return (
        <AtInput
          type="number"
          cursor={-1}
          name={fieldKey}
          title={fieldName}
          required={isRequired}
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
            title={
              <View className="flex items-center gap-1">
                {isRequired && <Text className="text-red-600">*</Text>}
                {fieldName}
              </View>
            }
            extraText={previewValue || "请选择"}
            arrow="right"
          />
        </Picker>
      );
    case CrmDataTypeEnum.Picker:
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
            title={
              <View className="flex items-center gap-1">
                {isRequired && <Text className="text-red-600">*</Text>}
                {fieldName}
              </View>
            }
            extraText={value || "请选择"}
            arrow="right"
          />
        </Picker>
      );
    case CrmDataTypeEnum.PickerOrOther:
      return (
        <PickerOrOther
          value={value}
          onChange={onChange}
          options={selectOptions}
          fieldName={fieldName}
          isRequired={isRequired}
          fieldKey={fieldKey}
        />
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
            title={
              <View className="flex items-center gap-1">
                {isRequired && <Text className="text-red-600">*</Text>}
                {fieldName}
              </View>
            }
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
            title={
              <View className="flex items-center gap-1">
                {isRequired && <Text className="text-red-600">*</Text>}
                {fieldName}
              </View>
            }
            note={regionValue || "请选择"}
            arrow="right"
          />
        </Picker>
      );
    case CrmDataTypeEnum.Location:
      return (
        <Location
          value={value}
          onChange={onChange}
          fieldName={fieldName}
          isRequired={isRequired}
          fieldKey={fieldKey}
        />
      );
    case CrmDataTypeEnum.Resource:
      return (
        <ResourceUploader
          value={value}
          fieldName={fieldName}
          isRequired={isRequired}
          onUpload={() => handleChooseAndUpload(onChange)}
        />
      );
    default:
      return (
        <AtInput
          cursor={-1}
          name={fieldKey}
          title={fieldName}
          required={isRequired}
          placeholder={"请输入" + fieldName}
          value={value}
          onChange={onChange}
        />
      );
  }
}

// 选择器或自定义值
const PickerOrOther: React.FC<{
  value: any;
  onChange: any;
  options: string[];
  isRequired: boolean;
  fieldName: string;
  fieldKey: string;
}> = ({ value, onChange, options, isRequired, fieldName, fieldKey }) => {
  const [localValue, setLocalValue] = useState<any>(value);
  const [isInputMode, setIsInputMode] = useState(false); // true=输入框模式 false=选择器模式
  const [customInputVal, setCustomInputVal] = useState("");

  // 同步外部 value 变化
  useEffect(() => {
    setLocalValue(value);
    if (value && !options.includes(value)) {
      setIsInputMode(true);
      setCustomInputVal(value);
    }
  }, [value, options]);

  // 3. 拼接完整选项：预设选项 + 自定义输入选项
  const fullOptions = [...options, "其他"];

  // 4. Picker 选择回调
  const handlePickerChange = (e: any) => {
    const idx = parseInt(e.detail.value);
    const selected = fullOptions[idx];

    if (selected === "其他") {
      // 选择【其他】→ 切换为输入框模式
      setIsInputMode(true);
      setLocalValue("");
      onChange("");
    } else {
      setIsInputMode(false);
      setLocalValue(selected);
      onChange(selected);
    }
  };
  // 🔑 输入框变化
  const handleInputChange = (e: any) => {
    setCustomInputVal(e);
    onChange(e);
  };

  // 🔑 切回 Picker 选择器
  const switchToPicker = () => {
    setIsInputMode(false);
    setCustomInputVal("");
  };

  return (
    <View className="w-full">
      {/* ====================== */}
      {/* 模式 1：Picker 选择器（默认） */}
      {/* ====================== */}
      {!isInputMode && (
        <Picker
          value={localValue || "未选择"}
          onChange={handlePickerChange}
          range={fullOptions}
        >
          <AtListItem
            title={
              <View className="flex items-center gap-1">
                {isRequired && <Text className="text-red-600">*</Text>}
                {fieldName}
              </View>
            }
            extraText={localValue || "请选择"}
            arrow="right"
          />
        </Picker>
      )}

      {/* ====================== */}
      {/* 模式 2：Input 输入框（选择其他后显示） */}
      {/* ====================== */}
      {isInputMode && (
        <View className="flex items-center justify-between pr-4">
          <AtInput
            cursor={-1}
            name={fieldKey}
            title={fieldName}
            required={isRequired}
            placeholder={customInputVal ? "" : "请输入" + fieldName}
            value={customInputVal}
            onChange={handleInputChange}
          />
          <AtIcon
            value="repeat-play"
            size="24"
            color="#999"
            onClick={switchToPicker}
            className="cursor-pointer"
          />
        </View>
      )}
    </View>
  );
};

const getResourceUrl = (value: string) => {
  if (!value) {
    return "";
  }
  if (/^(https?:)?\/\//.test(value) || value.startsWith("data:")) {
    return value;
  }
  try {
    const origin = new URL(process.env.TARO_APP_BACKEND_ENDPOINT).origin;
    return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
  } catch {
    return value;
  }
};

const ResourceUploader: React.FC<{
  value: string;
  fieldName: string;
  isRequired: boolean;
  onUpload: () => void;
}> = ({ value, fieldName, isRequired, onUpload }) => {
  const resourceUrl = getResourceUrl(value);
  return (
    <View className="crm-resource-field">
      <View className="crm-resource-field__header">
        <View className="crm-resource-field__title">
          {isRequired && <Text className="crm-resource-field__required">*</Text>}
          <Text>{fieldName}</Text>
        </View>
        <Text
          className={`crm-resource-field__status ${
            value ? "crm-resource-field__status--ready" : ""
          }`}
        >
          {value ? "已上传" : "未上传"}
        </Text>
      </View>

      <View className="crm-resource-field__body">
        {value ? (
          <Image
            className="crm-resource-field__preview"
            src={resourceUrl}
            mode="aspectFill"
            showMenuByLongpress
            defaultSource={DEFAULT_IMAGE_BASE64}
          />
        ) : (
          <View className="crm-resource-field__empty">
            <AtIcon value="image" size="28" color="#94a3b8" />
          </View>
        )}

        <View className="crm-resource-field__content">
          <Text className="crm-resource-field__name">
            {value ? "资源文件" : "添加资源文件"}
          </Text>
          <Text className="crm-resource-field__hint">
            {value ? "长按预览图可保存或查看" : "从聊天文件中选择并上传"}
          </Text>
          <Button
            className="crm-resource-field__button"
            hoverClass="crm-resource-field__button--hover"
            onClick={onUpload}
          >
            <View className="crm-resource-field__button-inner">
              <AtIcon value={value ? "reload" : "upload"} size="15" color="#fff" />
              <Text>{value ? "更换" : "上传"}</Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  );
};

const ResourcePreview: React.FC<{value: string; fieldName: string;}> = ({value, fieldName}) => {
  const resourceUrl = getResourceUrl(value);
  if (!value) {
    return <TextPreview text="-"/>
  }

  const handlePreview = () => {
    Taro.previewImage({
      current: resourceUrl,
      urls: [resourceUrl],
    });
  };

  return (
    <View
      className="h-10 w-10 p-1"
      onClick={handlePreview}
    >
      <Image
        className="h-full w-full"
        src={resourceUrl}
        mode="heightFix"
        showMenuByLongpress
        defaultSource={DEFAULT_IMAGE_BASE64}
      />
  
   
    </View>
  );
}

const Location: React.FC<{
  value: any;
  onChange: any;
  isRequired: boolean;
  fieldName: string;
  fieldKey: string;
}> = ({ value, onChange, isRequired, fieldName, fieldKey }) => {
  const [locationValue, setLocationValue] = useState<any>({});
  useEffect(() => {
    try {
      const loc = JSON.parse(value);
      setLocationValue(loc);
    } catch { }
  }, [value]);
  return (
    <View className="flex items-center justify-between pr-4">
      <AtInput
        cursor={-1}
        name={fieldKey}
        title={fieldName}
        required={isRequired}
        placeholder={"请输入" + fieldName}
        value={locationValue?.address}
        onChange={(val) => {
          onChange(
            JSON.stringify({
              latitude: locationValue?.latitude,
              longitude: locationValue?.longitude,
              address: val,
            }),
          );
        }}
      />
      <View
        onClick={(e) => {
          Taro.chooseLocation({
            success: (res) => {
              const latitude = res.latitude;
              const longitude = res.longitude;
              const name = res.name
              onChange(
                JSON.stringify({
                  latitude: latitude,
                  longitude: longitude,
                  address: name,
                }),
              );
            },
          });
        }}
      >
        <AtIcon value="map-pin" size="22" />
      </View>
    </View>
  );
};


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
      return <TextPreview text={data?.[field.fieldKey] === true ? "是" : "否"}/>;
    case CrmDataTypeEnum.Region:
      return <TextPreview text={findSelectedNodes(data?.[field.fieldKey])}/>
    case CrmDataTypeEnum.Location:
      let addr = "";
      try {
        let loc = JSON.parse(data?.[field.fieldKey]);
        addr = loc?.address;
      } catch {
        addr = data?.[field.fieldKey];
      }
      return <TextPreview text={addr}/>
    case CrmDataTypeEnum.Resource:
      return <ResourcePreview fieldName={field.fieldName} value={data?.[field.fieldKey]}/>
    default:
      return <TextPreview text={data?.[field.fieldKey]}/>
  }
};

const TextPreview = ({text}:{text:string}) => {
  return (
       <Text className={`text-sm font-medium text-right`}>
            {text}
            </Text>
  )
}
