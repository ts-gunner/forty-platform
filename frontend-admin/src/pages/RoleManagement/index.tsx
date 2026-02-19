import { createRole, deleteRole, getRoleList, updateRole } from "@/services/steins-admin/roleController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button } from "antd";
import { useRef, useState } from "react";
import CreateRoleModal from "./CreateRoleModal";
import UpdateRoleModal from "./UpdateRoleModal";

export default function RoleTablePage() {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [currentRecord, setCurrentRecord] = useState<API.RoleVo>();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const columns: ProColumns<API.RoleVo>[] = [
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
      align: "center",
      width: 140,
    },
    {
      title: "角色标识",
      dataIndex: "roleKey",
      key: "roleKey",
      align: "center",
      width: 140,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      hideInSearch: true,
      width: 180,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      align: "center",
      hideInSearch: true,
      width: 180,
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
            onClick={async () => {
              const resp = await deleteRole({
                roleId: record.roleId as number,
              });
              handleResponse({
                resp,
                onSuccess: () => {
                  Notify.ok("角色已删除");
                  actionRef.current?.reload();
                },
                onError: () => {
                  Notify.fail("角色删除失败：" + resp.msg);
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
      <ProTable<API.RoleVo, API.getRoleListParams>
        actionRef={actionRef}
        columns={columns}
        key={"roleId"}
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
          pageSize: pageSize,
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
        request={async (params) => {
          const resp = await getRoleList({
            pageNum: params.current || 1,
            pageSize: params.pageSize || 20,
            roleName: params.roleName,
            roleKey: params.roleKey,
          });
          let tableData: API.RoleVo[] = [];
          let total: number = 0;
          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.list || [];
              total = data.total || 0;
            },
            onError: () => {
              Notify.fail("获取角色列表数据失败:" + resp.msg);
            },
          });
          return {
            data: tableData,
            total: total,
            success: true,
          };
        }}
      ></ProTable>
      <CreateRoleModal
        modalOpen={createModalOpen}
        handleModalOpen={handleCreateModalOpen}
        onSubmit={async (data: API.RoleCreateRequest) => {
          const resp = await createRole(data);
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
      <UpdateRoleModal
        modalOpen={updateModalOpen}
        handleModalOpen={handleUpdateModalOpen}
        onSubmit={async (data: API.RoleUpdateRequest) => {
          const resp = await updateRole({
            ...data,
            roleId: currentRecord?.roleId as number
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
    </div>
  );
}
