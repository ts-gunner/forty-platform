import { AgentKeyMap, StatusOptions } from "@/constants/enums";
import { Form, Input, Modal, Select } from "antd";
type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: API.AddQuestionExampleRequest) => void;
};
export default function CreateQuestionModal({ modalOpen, handleModalOpen,onSubmit }: ModalProps) {
  const [formRef] = Form.useForm();
  return (
    <Modal 
    title="创建问题示例"
    open={modalOpen} closable={false} className="" onCancel={() => handleModalOpen(false)} onOk={async () => {
        const data = await formRef.validateFields()
        onSubmit(data)
    }}>
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
            <Select
              options={StatusOptions}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
