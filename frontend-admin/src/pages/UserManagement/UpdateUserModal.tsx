import { StatusOptions } from "@/constants/enums";
import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.UserVo | undefined;
  onSubmit: (data: API.UserUpdateRequest) => void;
};
export default function UpdateUserModal({ modalOpen, handleModalOpen, value, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
  useEffect(() => {
    if (modalOpen && value) {
      formRef.setFieldsValue(value);
    } else if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen, value]);
  return (
    <Modal
      title="更新用户信息"
      open={modalOpen}
      closable={false}
      className=""
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        const data = await formRef.validateFields();
        onSubmit({
          ...data,
        });
      }}
    >
      <div className="p-3">
        <Form form={formRef} labelAlign="right" labelCol={{span: 4}} >
          <Form.Item label="昵称" name="nickName">
            <Input />
          </Form.Item>
          <Form.Item label="手机号码" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="是否可用" name="status">
            <Select options={StatusOptions} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
