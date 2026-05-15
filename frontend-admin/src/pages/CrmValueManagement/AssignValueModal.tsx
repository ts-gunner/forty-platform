import { SystemRoleEnum } from "@/constants/enums";
import { getUserListByRoleKey } from "@/services/steins-admin/systemUserController";
import { handleResponse, Notify } from "@/utils/common";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Typography, Upload } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  onSubmit: (userId: string) => Promise<void>;
};

export default function AssignValueModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userList, setUserList] = useState<API.UserVo[]>([]);

  useEffect(() => {
    getCrmUsers();
  }, []);

  const getCrmUsers = async () => {
    const resp = await getUserListByRoleKey({
      roleKey: SystemRoleEnum.ROLE_WECHAT_CRM,
      pageNum: 1,
      pageSize: 99999,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setUserList(data.list || []);
      },
      onError: () => {
        Notify.fail("获取业务员列表失败");
      },
    });
  };

  return (
    <Modal
      title="转让客户数据"
      open={modalOpen}
      onCancel={() => handleModalOpen(false)}
      width={560} // 更合理的固定宽度
      confirmLoading={btnLoading}
      centered
      onOk={async () => {
        try {
          setBtnLoading(true);
        
          if (!selectedUser) {
            Notify.fail("没有选择业务员");
            return;
          }
          await onSubmit(selectedUser);
        } finally {
          setBtnLoading(false);
        }
      }}
    >
      <div className="space-y-6 py-2">

        {/* 业务员选择 */}
        <div className="flex flex-col gap-2 w-full">
          <Text strong className="text-gray-700">
            转让的业务员
          </Text>
          <Select
            value={selectedUser}
            placeholder="请选择业务员"
            size="large"
            className="w-full"
            onChange={(val) => setSelectedUser(val)}
            options={userList.map((it) => ({
              label: `${it.nickName}`,
              value: it.userId,
            }))}
            notFoundContent="暂无业务员数据"
          />
        </div>

      </div>
    </Modal>
  );
}
