import { CrmDataTypeEnum } from '@/constants/enums';
import { DatePicker, Input, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';

export default function ValueBoxGenerator({ field, value, onChange }: { field: API.CrmEntityFieldVo, [key: string]: any }) {
  const { dataType, fieldName, options } = field;

  switch (dataType) {
    case CrmDataTypeEnum.Number:
      return <InputNumber value={value}  onChange={onChange} className="w-full" placeholder={`请输入${fieldName}`} />;

    case CrmDataTypeEnum.Picker:
      const selectOptions = options ? options.split(",") : []
      return (
        <Select
          value={value}
          onChange={onChange}
          placeholder={`请选择${fieldName}`}
          options={selectOptions.map((opt: any) => ({
            label: opt,
            value: opt,
          }))}
        ></Select>
      );
    case CrmDataTypeEnum.Date:
      const dateValue = value ? dayjs(value) : undefined;
      return <DatePicker value={dateValue}  onChange={(val) => {
        onChange(val?.format("YYYY-MM-DD"))
      }} className="w-full" format={"YYYY-MM-DD"} />;
    default:
      return <Input value={value}  onChange={onChange} placeholder={`请输入${fieldName}`} />;
  }
}
