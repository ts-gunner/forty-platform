import { StatusOptions } from "@/constants/enums";
import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: API.UserCreateRequest) => void;
};
export default function CreateUserModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
   useEffect(() => {
      if (!modalOpen) {
        formRef.resetFields();
      } 
    }, [modalOpen]);
  return (
    <Modal
      title="创建用户"
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
        <Form form={formRef} labelAlign="right" labelCol={{span: 4}} initialValues={{
          status: 1
        }}>
          <Form.Item label="用户名" name="account" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="昵称" name="nickName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号码" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="是否可用" name="status" rules={[{ required: true }]}>
            <Select options={StatusOptions} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
