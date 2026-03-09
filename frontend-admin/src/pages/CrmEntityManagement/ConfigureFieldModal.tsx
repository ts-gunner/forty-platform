import { Button, Form, Input, Modal, Select } from "antd";
import { Space, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.CrmEntityVo | undefined;
  onSubmit: () => Promise<void>;
};

export default function ConfigureFieldModal({ modalOpen, handleModalOpen, onSubmit, value }: ModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  useEffect(() => {
    if (modalOpen && value) {
      // formRef.setFieldsValue(value);
    } else if (!modalOpen) {
      // formRef.resetFields();
    }
  }, [modalOpen, value]);
  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };


  return (
    <Modal
      title="创建客户实体字段"
      open={modalOpen}
      closable={false}
      className=""
      width={"80%"}
      confirmLoading={btnLoading}
      destroyOnHidden
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        setBtnLoading(true);
        // const data = await formRef.validateFields();
        // await onSubmit(data);
        setBtnLoading(false);
      }}
    >
      <div className="w-full">
        <Form

          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <div className="">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="flex-1 text-gray-500 font-medium text-center">字段Key</div>
                  <div className="flex-1 text-gray-500 font-medium text-center">字段名称</div>
                  <div className="flex-1 text-gray-500 font-medium text-center">数据类型</div>
                  <div className="flex-1 text-gray-500 font-medium text-center">是否必填</div>
                  <div className="flex-1 text-gray-500 font-medium text-center">排列顺序</div>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <div className="flex gap-2 mb-2 px-1">
                    <Form.Item
                      name={[name, 'fieldKey']}
                      className="flex-1"
                      rules={[{ required: true, message: '缺少字段key' }]}
                    >
                      <Input placeholder="填写字段key（仅限英文）" />
                    </Form.Item>
                    <Form.Item
                      className="flex-1"
                      name={[name, 'displayName']}
                      rules={[{ required: true, message: '缺少字段中文名' }]}
                    >
                      <Input placeholder="填写字段中文描述" />
                    </Form.Item>
                    <Form.Item
                      className="flex-1"
                      name={[name, 'dataType']}
                      initialValue={1}
                      rules={[{ required: true, message: '数据类型' }]}
                    >
                      <Select options={[
                        {
                          label: "文本",
                          value: 1
                        },
                        {
                          label: "数字",
                          value: 2
                        },
                        {
                          label: "布尔",
                          value: 3
                        },
                      ]} />
                    </Form.Item>
                    <Form.Item
                      className="flex-1"
                      initialValue={1}
                      name={[name, 'isRequired']}
                      rules={[{ required: true, message: '是否必填' }]}
                    >
                      <Select options={[
                        {
                          label: "是",
                          value: 1
                        },
                        {
                          label: "否",
                          value: 0
                        },
                      ]} />
                    </Form.Item>
                    <Form.Item
                      className="flex-1"
                      name={[name, 'sortOrder']}
                      initialValue={0}
                      rules={[{ required: true, message: '排列顺序' }]}
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                      <Trash2 onClick={() => remove(name)} className="w-5 h-5"/>
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    新增字段
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Form>
      </div>
    </Modal>
  );
}
