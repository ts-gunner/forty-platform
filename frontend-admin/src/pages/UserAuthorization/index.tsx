import { getUserList } from "@/services/steins-admin/userController";
import { getRolesByUserId, assignRolesToUser } from "@/services/steins-admin/userRoleRelController";
import { getRoleList } from "@/services/steins-admin/roleController";
import { handleResponse, Notify } from "@/utils/common";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Modal, Transfer } from "antd";
import { useRef, useState, useEffect } from "react";

export default function UserAuthorizationPage() {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [authModalOpen, handleAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<API.UserVo>();
  const [allRoles, setAllRoles] = useState<API.RoleVo[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const loadAllRoles = async () => {
    const resp = await getRoleList({ pageNum: 1, pageSize: 1000 });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setAllRoles(data.list || []);
      },
      onError: () => {
        Notify.fail("获取角色列表失败:" + resp.msg);
      },
    });
  };

  const loadUserRoles = async (userId: number) => {
    const resp = await getRolesByUserId({ userId });
    handleResponse({
      resp,
      onSuccess: (data) => {
        const roleIds = (data || []).map((item: API.UserRoleRelVo) => item.roleId);
        setSelectedRoleIds(roleIds);
        setTargetKeys(roleIds.map(String));
      },
      onError: () => {
        Notify.fail("获取用户角色失败:" + resp.msg);
      },
    });
  };

  useEffect(() => {
    if (authModalOpen && currentUser) {
      loadAllRoles();
      loadUserRoles(currentUser.userId as number);
    }
  }, [authModalOpen, currentUser]);

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
              setCurrentUser(record);
              handleAuthModalOpen(true);
            }}
          >
            授权角色
          </a>
        </div>
      ),
    },
  ];

  const handleTransferChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleAssignRoles = async () => {
    if (!currentUser) return;
    const roleIds = targetKeys.map(Number);
    const resp = await assignRolesToUser({
      userId: currentUser.userId as number,
      roleIds: roleIds,
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
      <ProTable<API.UserVo, API.getUserListParams>
        actionRef={actionRef}
        columns={columns}
        key={"userId"}
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

      <Modal
        title={`用户授权 - ${currentUser?.nickName || currentUser?.account}`}
        open={authModalOpen}
        onCancel={() => handleAuthModalOpen(false)}
        onOk={handleAssignRoles}
        width={700}
      >
        <Transfer
          dataSource={allRoles.map((role) => ({
            key: String(role.roleId),
            title: role.roleName,
            description: role.roleKey,
          }))}
          titles={["未分配角色", "已分配角色"]}
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
