import { getEntityList } from "@/services/steins-admin/crmEntityController";
import { getFieldsByEntityId } from "@/services/steins-admin/crmEntityFieldController";
import {
  deleteEntityValue,
  getEntityValueListByAdmin,
  insertEntityValue,
  updateEntityValue,
  uploadCrmExcel,
} from "@/services/steins-admin/crmEntityValueController";
import { handleResponse, Notify } from "@/utils/common";
import { generateCrmValueColumns } from "@/utils/crm";
import { CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Popconfirm, Tabs, Upload } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { history } from "umi";
import CreateEntityValueModal from "./CreateEntityValueModal";
import UpdateEntityValueModal from "./UpdateEntityValueModal";

export default function CrmValueManagementPage() {
  const [entityData, setEntityData] = useState<API.CrmEntityVo[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  useEffect(() => {
    getEntities();
  }, []);
  const getEntities = async () => {
    const resp = await getEntityList({
      pageNum: 1,
      pageSize: 999,
    });

    handleResponse({
      resp,
      onSuccess: (data) => {
        let val = data.list || [];
        setEntityData(val);
        setActiveKey(val?.[0]?.entityId);
      },
      onError: () => {
        Notify.fail("获取实体列表数据失败:" + resp.msg);
      },
    });
  };
  return (
    <div>
      <Tabs
        defaultActiveKey={entityData?.[0]?.entityId}
        activeKey={activeKey}
        onChange={(key: string) => {
          setActiveKey(key);
        }}
        key="entityId"
        items={entityData.map((it, i) => {
          return {
            key: it.entityId as string,
            label: it.entityName,
            children: <CrmValueTable entity={it} activeKey={activeKey} />,
          };
        })}
      />
    </div>
  );
}

const CrmValueTable: React.FC<{ entity: API.CrmEntityVo; activeKey: string | undefined }> = ({ entity, activeKey }) => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentValue, handleCurrentValue] = useState<any>({});
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [entityFields, setEntityFields] = useState<API.CrmEntityFieldVo[]>([]);
  useEffect(() => {
    if (activeKey === entity.entityId) {
      getEntityFields();
    }
  }, [activeKey]);

  const getEntityFields = async () => {
    setPageLoading(true);
    const resp = await getFieldsByEntityId({
      entityId: entity.entityId as string,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setEntityFields(data);
      },
      onError: () => {
        Notify.fail("获取实体表字段失败:" + resp.msg);
      },
      onFinish: () => {
        setPageLoading(false);
      },
    });
  };
  const columns: ProColumns[] = useMemo(() => {
    let columns: ProColumns[] = [];
    if (entityFields) {
      columns = generateCrmValueColumns(entityFields);
    }

    return [
      ...columns,
      {
        title: "创建人",
        dataIndex: "userName",
        hideInSearch: true,
        key: "userName",
        align: "center",
      },
      {
        title: "是否删除",
        dataIndex: "isDelete",
        key: "isDelete",
        align: "center",
        valueType: "select",
        order: 1,
        valueEnum: {
          0: { text: "存在", status: "Success" },
          1: { text: "已删除", status: "Error" },
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        align: "center",
        hideInSearch: true,
        render: (_, record: any) => {
          return (
            <div className="flex justify-center items-center gap-3">
              <a
                onClick={() => {
                  history.push(`/crm_value_detail/${record.id}`);
                }}
              >
                查看
              </a>
              <a
                onClick={() => {
                  handleCurrentValue(record);
                  handleUpdateModalOpen(true);
                }}
              >
                更新
              </a>
              <Popconfirm
                title="确认删除"
                onConfirm={async () => {
                  const resp = await deleteEntityValue({
                    id: record.id,
                  });
                  handleResponse({
                    resp,
                    onSuccess: () => {
                      Notify.ok("删除成功");
                      actionRef?.current?.reload();
                    },
                    onError: () => {
                      Notify.fail("删除失败：" + resp.msg);
                    },
                  });
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [entityFields]);
  return (
    <div style={{ width: "100%" }} key={entity.entityId}>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        key={"id"}
        toolBarRender={() => [
          <Upload
            maxCount={1}
            accept={".xlsx,.xls"}
            multiple={false}
            showUploadList={false}
            customRequest={async ({ file, onSuccess, onError }) => {
              setPageLoading(true);
              const resp = await uploadCrmExcel(
                {
                  entityId: entity.entityId,
                },
                file as File,
              );
              handleResponse({
                resp,
                onSuccess: () => {
                  Notify.ok("插入数据成功:" + resp.msg);
                  onSuccess?.(null)
                  actionRef.current?.reload()
                },
                onError: () => {
                  Notify.fail("录入数据失败:" + resp.msg);
                },
                onFinish: () => {
                  setPageLoading(false);
                }
              });
            }}
          >
            <Button key="upload_excel">
              <CloudUploadOutlined /> 上传表格
            </Button>
          </Upload>,
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
        request={async (params) => {
          const resp = await getEntityValueListByAdmin({
            pageNum: params.current,
            pageSize: params.pageSize,
            entityId: entity.entityId as string,
            isDelete: Number.parseInt(params.isDelete),
          });
          let tableData: any[] = [];
          let total = 0;
          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.entityValue?.list || [];
              total = data.entityValue?.total || 0;
            },
            onError: () => {
              Notify.fail("获取实体表数据失败:" + resp.msg);
            },
            onFinish: () => {},
          });

          return {
            data: tableData.map((it) => {
              return {
                ...it,
                ...(JSON.parse(it.values) || {}),
              };
            }),
            total: total,
            success: true,
          };
        }}
        pagination={{
          pageSize: pageSize,
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
      ></ProTable>
      <CreateEntityValueModal
        modalOpen={createModalOpen}
        handleModalOpen={handleCreateModalOpen}
        fieldList={entityFields}
        onSubmit={async (data) => {
          const resp = await insertEntityValue({
            entityId: entity?.entityId as string,
            data: [
              {
                customerName: data?.customer_name || "",
                remark: data?.remark || "",
                values: JSON.stringify(data),
              },
            ],
          });
          handleResponse({
            resp,
            onSuccess: () => {
              Notify.ok("新增成功");
              handleCreateModalOpen(false);
              actionRef?.current?.reload();
            },
            onError: () => {
              Notify.fail("新增失败：" + resp.msg);
            },
          });
        }}
      />
      <UpdateEntityValueModal
        modalOpen={updateModalOpen}
        handleModalOpen={handleUpdateModalOpen}
        fieldList={entityFields}
        value={currentValue}
        onSubmit={async (data) => {
          const resp = await updateEntityValue({
            id: currentValue.id,
            customerName: data?.customer_name || "",
            remark: data?.remark || "",
            values: JSON.stringify(data),
          });
          handleResponse({
            resp,
            onSuccess: () => {
              Notify.ok("更新成功");
              handleUpdateModalOpen(false);
              actionRef?.current?.reload();
            },
            onError: () => {
              Notify.fail("更新失败：" + resp.msg);
            },
          });
        }}
      />
    </div>
  );
};
