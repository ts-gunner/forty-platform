import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.CrmEntityVo | undefined;
  onSubmit: (data: API.EntityUpdateRequest) => Promise<void>;
};

export default function UpdateEntityModal({ modalOpen, handleModalOpen, value, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    if (modalOpen && value) {
      formRef.setFieldsValue(value);
    } else if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen, value]);

  return (
    <Modal
      title="更新客户实体"
      open={modalOpen}
      closable={false}
      className=""
      confirmLoading={btnLoading}
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        setBtnLoading(true);
        const data = await formRef.validateFields();
        await onSubmit(data);
        setBtnLoading(false);
      }}
    >
      <div className="p-3">
        <Form form={formRef} labelAlign="right" labelCol={{ span: 4 }}>
          <Form.Item label="实体名称" name="entityName">
            <Input />
          </Form.Item>
          <Form.Item label="实体标识" name="entityCode">
            <Input placeholder="如: customer_info" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
