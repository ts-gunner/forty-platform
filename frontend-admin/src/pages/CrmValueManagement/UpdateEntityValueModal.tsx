import ValueBoxGenerator from '@/components/crm/ValueBoxGenerator';
import { Form, Modal} from 'antd';
import React, { useEffect, useState } from 'react'



type ModalProps = {
    modalOpen: boolean;
    handleModalOpen: any;
    onSubmit: (data: any) => Promise<void>;
    value: any;
    fieldList: API.CrmEntityFieldVo[];
};


export default function UpdateEntityValueModal({ modalOpen, handleModalOpen, fieldList, onSubmit, value }: ModalProps) {
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
     useEffect(() => {
        if (modalOpen && value) {
          form.setFieldsValue(value);
        } else if (!modalOpen) {
          form.resetFields();
        }
      }, [modalOpen, value]);
 
    return (
        <Modal
            title="更新客户数据"
            open={modalOpen}
            onCancel={() => handleModalOpen(false)}
            className=""
            width={"70%"}
            confirmLoading={btnLoading}
            destroyOnHidden
            onOk={async () => {
                try {
                    setBtnLoading(true);
                    const data = await form.validateFields();
                    await onSubmit(data);
                } finally {
                    setBtnLoading(false);

                }

            }}
        >
            <Form
                form={form}
                layout="vertical"
                className="mt-4"
            >
                <div className="grid grid-cols-2 gap-x-4">
                    {fieldList
                        ?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                        .map((field) => (
                            <Form.Item
                                key={field.fieldKey}
                                name={field.fieldKey}
                                label={field.fieldName}
                                rules={[{ required: field.isRequired, message: `${field.fieldName}是必填项` }]}
                                className="col-span-1"
                            >
                              <ValueBoxGenerator field={field}/>
                            </Form.Item>
                        ))}
                </div>
            </Form>
        </Modal>
    );
}
