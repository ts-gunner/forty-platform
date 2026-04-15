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
  onSubmit: (file: File, userId: string) => Promise<void>;
};

export default function UploadValueModal({ modalOpen, handleModalOpen, onSubmit }: ModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userList, setUserList] = useState<API.UserVo[]>([]);

  useEffect(() => {
    getCrmUsers();
  }, []);

  const getCrmUsers = async () => {
    const resp = await getUserListByRoleKey({
      roleKey: SystemRoleEnum.ROLE_WECHAT_CRM,
      pageNum: 1,
      pageSize: 999,
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
      title="上传客户数据"
      open={modalOpen}
      onCancel={() => handleModalOpen(false)}
      width={560} // 更合理的固定宽度
      confirmLoading={btnLoading}
      centered
      onOk={async () => {
        try {
          setBtnLoading(true);
          if (!uploadFile) {
            Notify.fail("没有上传文件");
            return;
          }
          if (!selectedUser) {
            Notify.fail("没有选择业务员");
            return;
          }
          await onSubmit(uploadFile, selectedUser);
        } finally {
          setBtnLoading(false);
        }
      }}
    >
      <div className="space-y-6 py-2">
        {/* 文件上传区域 */}
        <div className="flex flex-col gap-2 w-full">
          <Text strong className="text-gray-700">
            选择Excel文件
          </Text>
          <Upload
            maxCount={1}
            accept={".xlsx,.xls"}
            multiple={false}
            showUploadList={false}
            beforeUpload={(file) => {
              setUploadFile(file as File);
              return true;
            }}
            customRequest={async () => {}}
          >
            <Button size="large" icon={<CloudUploadOutlined />} className="w-full h-14 border-dashed border-2">
              {uploadFile ? <span className="text-green-600">{uploadFile.name}</span> : "点击上传表格文件（仅支持 .xlsx / .xls）"}
            </Button>
          </Upload>
          {uploadFile && (
            <Text type="success" className="block text-sm">
              ✅ 已选择文件：{uploadFile.name}
            </Text>
          )}
        </div>

        {/* 业务员选择 */}
        <div className="flex flex-col gap-2 w-full">
          <Text strong className="text-gray-700">
            分配业务员
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

        {/* 提示说明 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <Text type="secondary" className="text-xs">
            提示：上传后系统将自动把客户数据分配给选中的业务员，请确保文件格式正确。
          </Text>
        </div>
      </div>
    </Modal>
  );
}
