import Button from "@/components/ui/button/Button";
import { PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Modal } from "antd";
import { useRef, useState } from "react";
import UserForm from "../../components/user-management/UserForm";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { addSystemUser, deleteSystemUser, pageUsers, updateSystemUser } from "../../services/steins-admin/sysUserController";
import { handleResponse, Notify } from "../../utils/common";

const UserManagement = () => {
  const actionRef = useRef<ActionType>();
  const [currentUser, setCurrentUser] = useState<API.SysUserVo | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const columns: ProColumns<API.SysUserVo>[] = [
    {
      title: "账号",
      dataIndex: "account",
      key: "account",
      ellipsis: true,
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
      ellipsis: true,
    },

    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      valueType: "select",
      valueEnum: {
        all: { text: "全部状态" },
        0: { text: "不可用", status: "Error" },
        1: { text: "可用", status: "Success" },
      },
      search: {
        transform: (val) => (val === "all" ? {} : { status: Number(val) }),
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      valueType: "dateTime",
      search: false,
    },
    {
      title: "操作",
      valueType: "option",
      key: "action",
      render: (_, record) => [
        <Button
          key="edit"
          size="xs"
          startIcon={<PencilIcon />}
          onClick={() => {
            setCurrentUser(record);
            setIsEditFormOpen(true);
          }}
        >
          {""}
        </Button>,
        <Button
          key="delete"
          size="xs"
          variant="outline"
          startIcon={<TrashBinIcon />}
          onClick={() => {
            Modal.confirm({
              title: "确认删除",
              content: "删除后不可恢复，是否继续？",
              okType: "danger",
              onOk: async () => {
                const resp = await deleteSystemUser({ userId: record.userId || "" });
                handleResponse({
                  resp,
                  onSuccess: () => {
                    Notify.ok("用户删除成功");
                    actionRef.current?.reload();
                  },
                });
              },
            });
          }}
        >
          {""}
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable<API.SysUserVo>
        rowKey="userId"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const resp = await pageUsers({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            nickname: params.username,
            status: params.status,
            isAdmin: params.isAdmin,
          });

          let tableData: API.SysUserVo[] = [];
          let total = 0;

          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.records || [];
              total = Number(data.total);
            },
          });

          return {
            data: tableData,
            total,
            success: true,
          };
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 80,
          span: 6,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            size="xs"
            onClick={() => {
              setCurrentUser(null);
              setIsAddFormOpen(true);
            }}
          >
            <PlusOutlined />
            添加用户
          </Button>,
        ]}
      />

      {isAddFormOpen && (
        <UserForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          title="添加用户"
          onSubmit={async (data) => {
            const resp = await addSystemUser(data);
            handleResponse({
              resp,
              onSuccess: () => {
                Notify.ok("用户添加成功");
                setIsAddFormOpen(false);
                actionRef.current?.reload();
              },
            });
          }}
        />
      )}

      {isEditFormOpen && currentUser && (
        <UserForm
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          title="编辑用户"
          initialData={currentUser}
          onSubmit={async (data) => {
            const resp = await updateSystemUser({
              ...data,
              userId: currentUser.userId,
            });
            handleResponse({
              resp,
              onSuccess: () => {
                Notify.ok("用户更新成功");
                setIsEditFormOpen(false);
                actionRef.current?.reload();
              },
            });
          }}
        />
      )}
    </>
  );
};

export default UserManagement;
