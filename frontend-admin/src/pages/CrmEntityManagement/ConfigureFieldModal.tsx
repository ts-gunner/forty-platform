import { Modal } from "antd";
import { useEffect, useState } from "react";

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
  return (
    <Modal
      title="创建客户实体"
      open={modalOpen}
      closable={false}
      className=""
      confirmLoading={btnLoading}
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        setBtnLoading(true);
        // const data = await formRef.validateFields();
        // await onSubmit(data);
        setBtnLoading(false);
      }}
    ></Modal>
  );
}
