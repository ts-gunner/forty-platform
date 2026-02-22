import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";

const PermissionTypeOptions = [
  { label: "菜单", value: 0 },
  { label: "按钮", value: 1 },
];

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.PermissionVo | undefined;
  onSubmit: (data: API.PermissionUpdateRequest) => Promise<void>;
};
export default function UpdatePermissionModal({ modalOpen, handleModalOpen, value, onSubmit }: ModalProps) {
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
      title="更新权限信息"
      open={modalOpen}
      closable={false}
      className=""
      confirmLoading={btnLoading}
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        setBtnLoading(true);
        const data = await formRef.validateFields();
        await onSubmit({
          ...data,
        });
        setBtnLoading(false);
      }}
    >
      <div className="p-3">
        <Form form={formRef} labelAlign="right" labelCol={{ span: 4 }}>
          <Form.Item label="权限名称" name="permissionName">
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
