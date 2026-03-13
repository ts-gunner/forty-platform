import { Modal } from "antd";
import { useState } from "react";

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (data: any) => Promise<void>;
};
export default function CreateEntityValueModal({ modalOpen, handleModalOpen }: ModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  return <Modal title="添加客户数据" open={modalOpen} closable={false} className="" width={"70%"} confirmLoading={btnLoading} destroyOnHidden>

    
  </Modal>;
}
