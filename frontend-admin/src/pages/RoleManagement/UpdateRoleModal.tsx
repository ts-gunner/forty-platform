import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.RoleVo | undefined;
  onSubmit: (data: API.RoleUpdateRequest) => Promise<void>;
};
export default function UpdateRoleModal({ modalOpen, handleModalOpen, value, onSubmit }: ModalProps) {
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
      title="更新角色信息"
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
          <Form.Item label="角色名称" name="roleName">
            <Input />
          </Form.Item>
          <Form.Item label="角色标识" name="roleKey">
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
