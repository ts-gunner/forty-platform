import { CrmDataTypeEnum } from "@/constant/enums";
import { findSelectedNodes } from "@/utils/region";
import { Input, Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { AtIcon, AtInput, AtListItem, AtTextarea } from "taro-ui";

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
            placeholder={"请输入" + fieldName}
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
    } catch {}
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
