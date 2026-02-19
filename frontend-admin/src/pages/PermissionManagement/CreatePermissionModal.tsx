import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";

const PermissionTypeOptions = [
  { label: "菜单", value: 0 },
  { label: "按钮", value: 1 },
];

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: API.PermissionCreateRequest) => void;
};
export default function CreatePermissionModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
  useEffect(() => {
    if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen]);
  return (
    <Modal
      title="创建权限"
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
        <Form form={formRef} labelAlign="right" labelCol={{ span: 4 }} initialValues={{ type: 0 }}>
          <Form.Item label="权限名称" name="permissionName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="权限标识" name="perms">
            <Input placeholder="如: system:user:create" />
          </Form.Item>
          <Form.Item label="类型" name="type">
            <Select options={PermissionTypeOptions} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
