import { createEntity, deleteEntity, getEntityList, updateEntity } from "@/services/steins-admin/crmEntityController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import CreateEntityModal from "./CreateEntityModal";
import UpdateEntityModal from "./UpdateEntityModal";
import ConfigureFieldModal from "./ConfigureFieldModal";

export default function CrmEntityTablePage() {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [currentRecord, setCurrentRecord] = useState<API.CrmEntityVo>();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [configureFieldModalOpen, handleConfigureFieldModalOpen] = useState<boolean>(false);

  const columns: ProColumns<API.CrmEntityVo>[] = [
    {
      title: "实体名称",
      dataIndex: "entityName",
      key: "entityName",
      align: "center",
      width: 140,
    },
    {
      title: "实体标识",
      dataIndex: "entityCode",
      key: "entityCode",
      align: "center",
      width: 160,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      align: "center",
      hideInSearch: true,
      width: 200,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      hideInSearch: true,
      width: 180,
      render: (_, record) => {
        return dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      align: "center",
      hideInSearch: true,
      width: 180,
      render: (_, record) => {
        return dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss");
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
              handleConfigureFieldModalOpen(true);
            }}
          >
            配置
          </a>
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
              const resp = await deleteEntity({
                entityId: record.entityId as string,
              });
              handleResponse({
                resp,
                onSuccess: () => {
                  Notify.ok("实体已删除");
                  actionRef.current?.reload();
                },
                onError: () => {
                  Notify.fail("实体删除失败：" + resp.msg);
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
      <ProTable<API.CrmEntityVo, API.getEntityListParams>
        actionRef={actionRef}
        columns={columns}
        key={"entityId"}
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
          const resp = await getEntityList({
            pageNum: params.current || 1,
            pageSize: params.pageSize || 20,
            entityName: params.entityName,
            entityCode: params.entityCode,
          });
          let tableData: API.CrmEntityVo[] = [];
          let total: number = 0;
          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.list || [];
              total = data.total || 0;
            },
            onError: () => {
              Notify.fail("获取实体列表数据失败:" + resp.msg);
            },
          });
          return {
            data: tableData,
            total: total,
            success: true,
          };
        }}
      ></ProTable>
      <CreateEntityModal
        modalOpen={createModalOpen}
        handleModalOpen={handleCreateModalOpen}
        onSubmit={async (data: API.EntityCreateRequest) => {
          const resp = await createEntity(data);
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
      <UpdateEntityModal
        modalOpen={updateModalOpen}
        handleModalOpen={handleUpdateModalOpen}
        onSubmit={async (data: API.EntityUpdateRequest) => {
          const resp = await updateEntity({
            ...data,
            entityId: currentRecord?.entityId as string,
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
      <ConfigureFieldModal 
        modalOpen={configureFieldModalOpen}
        handleModalOpen={handleConfigureFieldModalOpen}
        onSubmit={async () => {
          
        }}
        value={currentRecord}
      />
    </div>
  );
}
