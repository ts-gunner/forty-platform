import { CrmDataTypeEnum } from "@/constants/enums";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import { useState } from "react";

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: any) => Promise<void>;
  fieldList: API.CrmEntityFieldVo[];
};
export default function CreateEntityValueModal({ modalOpen, handleModalOpen, fieldList, onSubmit }: ModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const renderFieldItem = (field: API.CrmEntityFieldVo) => {
    const { dataType, fieldName, options } = field;

    switch (dataType) {
      case CrmDataTypeEnum.Number:
        return <InputNumber className="w-full" placeholder={`请输入${fieldName}`} />;

      case CrmDataTypeEnum.Picker:
        const selectOptions = options ? options.split(","): []
        return (
          <Select
            placeholder={`请选择${fieldName}`}
            options={selectOptions.map((opt: any) => ({
              label: opt,
              value: opt,
            }))}
          ></Select>
        );
      case CrmDataTypeEnum.Date:
        return <DatePicker className="w-full" />;
      default:
        return <Input placeholder={`请输入${fieldName}`} />;
    }
  };
  return (
    <Modal
      title="添加客户数据"
      open={modalOpen}
      onCancel={() => handleModalOpen(false)}
      className=""
      width={"70%"}
      confirmLoading={btnLoading}
      destroyOnHidden
      onOk={async () => {
        try {
          setBtnLoading(true);
          const data = await form.validateFields();
          await onSubmit(data);
        } finally {
          setBtnLoading(false);

        }

      }}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <div className="grid grid-cols-2 gap-x-4">
          {fieldList
            ?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((field) => (
              <Form.Item
                key={field.fieldKey}
                name={field.fieldKey}
                label={field.fieldName}
                rules={[{ required: field.isRequired, message: `${field.fieldName}是必填项` }]}
                className="col-span-1"
              >
                {renderFieldItem(field)}
              </Form.Item>
            ))}
        </div>
      </Form>
    </Modal>
  );
}
