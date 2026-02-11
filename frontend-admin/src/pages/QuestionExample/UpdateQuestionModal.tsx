import { AgentKeyMap, StatusOptions } from "@/constants/enums";
import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.AigcQuestionExampleVo | undefined;
  onSubmit: (data: API.UpdateQuestionExampleRequest) => void;
};
export default function UpdateQuestionModal({ modalOpen, handleModalOpen, value, onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
  useEffect(() => {
    if (modalOpen && value) {
      formRef.setFieldsValue({
        question: value.question,
        agentKey: value.agentKey,
        status: value.status,
      });
    } else if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen, value]);
  return (
    <Modal
      title="更新问题示例"
      open={modalOpen}
      closable={false}
      className=""
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        const data = await formRef.validateFields();
        onSubmit({
            ...data,
            questionId: value?.questionId
        });
      }}
    >
      <div className="p-3">
        <Form form={formRef} labelAlign="right">
          <Form.Item label="问题示例" name="question" rules={[{ required: true }]}>
            <Input.TextArea></Input.TextArea>
          </Form.Item>
          <Form.Item label="知识库分类" name="agentKey" rules={[{ required: true }]}>
            <Select
              options={Object.entries(AgentKeyMap).map(([key, value]) => {
                return {
                  label: value,
                  value: key,
                };
              })}
            />
          </Form.Item>
          <Form.Item label="是否可用" name="status" rules={[{ required: true }]}>
            <Select options={StatusOptions} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
