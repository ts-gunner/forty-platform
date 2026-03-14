import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: API.EntityCreateRequest) => Promise<void>;
};

export default function CreateEntityModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen]);

  return (
    <Modal
      title="创建客户实体"
      open={modalOpen}
      closable={false}
      className=""
      confirmLoading={btnLoading}
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        try {
          setBtnLoading(true);
          const data = await formRef.validateFields();
          await onSubmit(data);
        }
        finally {
          setBtnLoading(false);
        }
      }}
    >
      <div className="p-3">
        <Form form={formRef} labelAlign="right" labelCol={{ span: 4 }}>
          <Form.Item label="实体名称" name="entityName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="实体标识" name="entityCode" rules={[{ required: true }]}>
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
