import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: API.RoleCreateRequest) => Promise<void>;
};
export default function CreateRoleModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen]);
  return (
    <Modal
      title="创建角色"
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
          <Form.Item label="角色名称" name="roleName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="角色标识" name="roleKey" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
