import { getRoleList } from "@/services/steins-admin/roleController";
import { getPermissionsByRoleId, assignPermissionsToRole } from "@/services/steins-admin/rolePermissionRelController";
import { getPermissionList } from "@/services/steins-admin/permissionController";
import { handleResponse, Notify } from "@/utils/common";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Modal, Transfer } from "antd";
import { useRef, useState, useEffect } from "react";

export default function RoleAuthorizationPage() {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [authModalOpen, handleAuthModalOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<API.RoleVo>();
  const [allPermissions, setAllPermissions] = useState<API.PermissionVo[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const loadAllPermissions = async () => {
    const resp = await getPermissionList({ pageNum: 1, pageSize: 1000 });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setAllPermissions(data.list || []);
      },
      onError: () => {
        Notify.fail("获取权限列表失败:" + resp.msg);
      },
    });
  };

  const loadRolePermissions = async (roleId: number) => {
    const resp = await getPermissionsByRoleId({ roleId });
    handleResponse({
      resp,
      onSuccess: (data) => {
        const permissionIds = (data || []).map((item: API.RolePermissionRelVo) => item.permissionId);
        setTargetKeys(permissionIds.map(String));
      },
      onError: () => {
        Notify.fail("获取角色权限失败:" + resp.msg);
      },
    });
  };

  useEffect(() => {
    if (authModalOpen && currentRole) {
      loadAllPermissions();
      loadRolePermissions(currentRole.roleId as number);
    }
  }, [authModalOpen, currentRole]);

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
              setCurrentRole(record);
              handleAuthModalOpen(true);
            }}
          >
            授权权限
          </a>
        </div>
      ),
    },
  ];

  const handleTransferChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleAssignPermissions = async () => {
    if (!currentRole) return;
    const permissionIds = targetKeys.map(Number);
    const resp = await assignPermissionsToRole({
      roleId: currentRole.roleId as number,
      permissionIds: permissionIds,
    });
    handleResponse({
      resp,
      onSuccess: () => {
        Notify.ok("授权成功!");
        handleAuthModalOpen(false);
      },
      onError: () => {
        Notify.fail("授权失败:" + resp.msg);
      },
    });
  };

  return (
    <div>
      <ProTable<API.RoleVo, API.getRoleListParams>
        actionRef={actionRef}
        columns={columns}
        key={"roleId"}
        search={{ span: 6 }}
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

      <Modal
        title={`角色授权 - ${currentRole?.roleName}`}
        open={authModalOpen}
        onCancel={() => handleAuthModalOpen(false)}
        onOk={handleAssignPermissions}
        width={700}
      >
        <Transfer
          dataSource={allPermissions.map((perm) => ({
            key: String(perm.permissionId),
            title: perm.permissionName,
            description: perm.perms,
          }))}
          titles={["未分配权限", "已分配权限"]}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
          render={(item) => item.title}
          listStyle={{
            width: 300,
            height: 400,
          }}
          showSearch
          filterOption={(input, option) =>
            (option.title as string).toLowerCase().includes(input.toLowerCase()) ||
            (option.description as string).toLowerCase().includes(input.toLowerCase())
          }
        />
      </Modal>
    </div>
  );
}
