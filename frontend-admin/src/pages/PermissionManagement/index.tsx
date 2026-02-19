import { createPermission, deletePermission, getPermissionList, updatePermission } from "@/services/steins-admin/permissionController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button } from "antd";
import { useRef, useState } from "react";
import CreatePermissionModal from "./CreatePermissionModal";
import UpdatePermissionModal from "./UpdatePermissionModal";

const PermissionTypeOptions = [
  { label: "全部类型", value: -1 },
  { label: "菜单", value: 0 },
  { label: "按钮", value: 1 },
];

export default function PermissionTablePage() {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [currentRecord, setCurrentRecord] = useState<API.PermissionVo>();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const columns: ProColumns<API.PermissionVo>[] = [
    {
      title: "权限名称",
      dataIndex: "permissionName",
      key: "permissionName",
      align: "center",
      width: 140,
    },
    {
      title: "权限标识",
      dataIndex: "perms",
      key: "perms",
      align: "center",
      width: 180,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: 100,
      valueType: "select",
      valueEnum: {
        0: { text: "菜单", status: "Processing" },
        1: { text: "按钮", status: "Success" },
      },
      search: {
        transform: (val) => (val === -1 ? {} : { type: Number(val) }),
      },
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
              const resp = await deletePermission({
                permissionId: record.permissionId as number,
              });
              handleResponse({
                resp,
                onSuccess: () => {
                  Notify.ok("权限已删除");
                  actionRef.current?.reload();
                },
                onError: () => {
                  Notify.fail("权限删除失败：" + resp.msg);
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
      <ProTable<API.PermissionVo, API.getPermissionListParams>
        actionRef={actionRef}
        columns={columns}
        key={"permissionId"}
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
          const resp = await getPermissionList({
            pageNum: params.current || 1,
            pageSize: params.pageSize || 20,
            permissionName: params.permissionName,
            perms: params.perms,
            type: params.type,
          });
          let tableData: API.PermissionVo[] = [];
          let total: number = 0;
          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.list || [];
              total = data.total || 0;
            },
            onError: () => {
              Notify.fail("获取权限列表数据失败:" + resp.msg);
            },
          });
          return {
            data: tableData,
            total: total,
            success: true,
          };
        }}
      ></ProTable>
      <CreatePermissionModal
        modalOpen={createModalOpen}
        handleModalOpen={handleCreateModalOpen}
        onSubmit={async (data: API.PermissionCreateRequest) => {
          const resp = await createPermission(data);
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
      <UpdatePermissionModal
        modalOpen={updateModalOpen}
        handleModalOpen={handleUpdateModalOpen}
        onSubmit={async (data: API.PermissionUpdateRequest) => {
          const resp = await updatePermission({
            ...data,
            permissionId: currentRecord?.permissionId as number
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
