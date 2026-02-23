import { Form, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
type ModalProps = {
    modalOpen: boolean;
    handleModalOpen: any;
    onSubmit: (data: API.UserResetPwdRequest) => Promise<void>;
};
export default function ResetPwdModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
    const [formRef] = Form.useForm();
    const [btnLoading, setBtnLoading] = useState<boolean>(false)
    useEffect(() => {
        if (!modalOpen) {
            formRef.resetFields();
        }
    }, [modalOpen]);
    return (
        <Modal
            title="重置用户密码"
            open={modalOpen}
            closable={false}
            className=""
            confirmLoading={btnLoading}
            onCancel={() => handleModalOpen(false)}
            onOk={async () => {
                try {
                    setBtnLoading(true)
                    const data = await formRef.validateFields();
                    await onSubmit(data);
                } finally {
                    setBtnLoading(false)
                }

            }}
        ><div className="p-3">
                <Form form={formRef} labelAlign="right" labelCol={{ span: 4 }} initialValues={{
                    status: 1
                }}>
                    <Form.Item label="新密码" name="newPassword" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>

                </Form>
            </div>
        </Modal>
    )
}
