import { createUser, deleteUser, getUserList, updatePassword, updateUser } from "@/services/steins-admin/userController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button } from "antd";
import { useRef, useState } from "react";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import ResetPwdModal from "./ResetPwdModal";

export default function UserTablePage() {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [currentRecord, setCurrentRecord] = useState<API.UserVo>();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [resetPwdModalOpen, handleResetPwdModalOpen] = useState<boolean>(false);
  const columns: ProColumns<API.UserVo>[] = [
    {
      title: "用户名",
      dataIndex: "account",
      key: "account",
      align: "center",
      width: 140,
    },
    {
      title: "昵称",
      dataIndex: "nickName",
      key: "nickName",
      align: "center",
      width: 140,
    },
    {
      title: "手机号码",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      hideInSearch: true,
      width: 140,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      valueType: "select",
      align: "center",
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
      title: "操作",
      valueType: "option",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center gap-3 justify-center">
          <a
            onClick={() => {
              setCurrentRecord(record);
              handleUpdateModalOpen(true);
            }}
          >
            更新
          </a>
          <a
            onClick={() => {
              setCurrentRecord(record);
              handleResetPwdModalOpen(true);
            }}
          >
            重置密码
          </a>
          <a
            onClick={async () => {
              const resp = await deleteUser({
                userId: record.userId as string,
              });
              handleResponse({
                resp,
                onSuccess: () => {
                  Notify.ok("问题示例状态已删除");
                  actionRef.current?.reload();
                },
                onError: () => {
                  Notify.fail("问题示例删除失败：" + resp.msg);
                },
              });
            }}
          >
            删除
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <ProTable<API.UserVo, API.getUserListParams>
        actionRef={actionRef}
        columns={columns}
        key={"questionId"}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        pagination={{
          pageSize: pageSize, // 默认每页显示数量
          pageSizeOptions: ["10", "20", "50", "100"], // 可选的每页显示数量
          showSizeChanger: true, // 显示分页大小选择器
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
        request={async (params) => {
          const resp = await getUserList({
            pageNum: params.current || 1,
            pageSize: params.pageSize || 20,
            nickName: params.nickName,
            account: params.account,
            status: params.status,
          });
          let tableData: API.UserVo[] = [];
          let total: number = 0;
          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.list || [];
              total = data.total || 0;
            },
            onError: () => {
              Notify.fail("获取用户列表数据失败:" + resp.msg);
            },
          });
          return {
            data: tableData,
            total: total,
            success: true,
          };
        }}
      ></ProTable>
      <CreateUserModal
        modalOpen={createModalOpen}
        handleModalOpen={handleCreateModalOpen}
        onSubmit={async (data: API.UserCreateRequest) => {
          const resp = await createUser(data);
          handleResponse({
            resp,
            onSuccess: () => {
              Notify.ok("创建成功!");
              actionRef.current?.reload();
            },
            onError: () => {
              Notify.fail("创建失败:" + resp.msg);
            },
            onFinish: () => {
              handleCreateModalOpen(false);
            },
          });
        }}
      />
      <UpdateUserModal
        modalOpen={updateModalOpen}
        handleModalOpen={handleUpdateModalOpen}
        onSubmit={async (data: API.UserUpdateRequest) => {
          const resp = await updateUser({
            ...data,
            userId: currentRecord?.userId as string
          });
          handleResponse({
            resp,
            onSuccess: () => {
              Notify.ok("更新成功!");
              actionRef.current?.reload();
            },
            onError: () => {
              Notify.fail("更新失败:" + resp.msg);
            },
            onFinish: () => {
              handleUpdateModalOpen(false);
            },
          });
        }}
        value={currentRecord}
      />
      <ResetPwdModal
        modalOpen={resetPwdModalOpen}
        handleModalOpen={handleResetPwdModalOpen}
        onSubmit={async (data: API.UserResetPwdRequest) => {
          const resp = await updatePassword({
            newPassword: data.newPassword,
            userId: currentRecord?.userId as string
          });
          handleResponse({
            resp,
            onSuccess: () => {
              Notify.ok("更新成功!");
              actionRef.current?.reload();
            },
            onError: () => {
              Notify.fail("更新失败:" + resp.msg);
            },
            onFinish: () => {
              handleResetPwdModalOpen(false);
            },
          });
        }}
      />
    </div>
  );
}
