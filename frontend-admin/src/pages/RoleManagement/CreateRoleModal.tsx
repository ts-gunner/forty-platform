import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: API.RoleCreateRequest) => void;
};
export default function CreateRoleModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
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
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        const data = await formRef.validateFields();
        onSubmit(data);
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
