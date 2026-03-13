import { getEntityList } from "@/services/steins-admin/crmEntityController";
import { getEntityValueList } from "@/services/steins-admin/crmEntityValueController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Tabs } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CreateEntityValueModal from "./CreateEntityValueModal";

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
        key="entity_id"
        items={entityData.map((it, i) => {
          const id = String(i + 1);
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
  const [page, setPage] = useState({
    current: 1,
    size: 20,
  });
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [entityObject, setEntityObject] = useState<API.CrmEntityValueObjectVo>();
  useEffect(() => {
    if (activeKey === entity.entityId) {
      getEntityInfo();
    }
  }, [activeKey]);

  const getEntityInfo = async () => {
    setDataLoading(true);
    const resp = await getEntityValueList({
      pageNum: page.current,
      pageSize: page.size,
      entityId: entity.entityId,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setEntityObject(data);
      },
      onError: () => {
        Notify.fail("获取实体表数据失败:" + resp.msg);
      },
      onFinish: () => {
        setDataLoading(false);
      },
    });
  };
  const columns: ProColumns[] = useMemo(() => {
    console.log("entityObject", entityObject);

    if (entityObject && Array.isArray(entityObject.field_list)) {
      const fieldColumns = entityObject.field_list.map((item): ProColumns => {
        return {
          title: item.fieldName,
          dataIndex: item.fieldKey,
          key: item.fieldKey,
          align: "center",
        };
      });
      return fieldColumns;
    }
    return [];
  }, [entityObject]);
  return (
    <>
      <ProTable
        loading={dataLoading}
        actionRef={actionRef}
        columns={columns}
        key={"entityId"}
        scroll={{
          x: "auto"
        }}
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
          pageSize: page.size,
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPage((prev) => ({
              ...prev,
              size,
            }));
          },
        }}
        dataSource={entityObject?.entity_value?.list || []}
      ></ProTable>

      <CreateEntityValueModal
       modalOpen={createModalOpen} handleModalOpen={handleCreateModalOpen} 
       fieldList={entityObject?.field_list || []}
       onSubmit={async () => {

      }} />
    </>
  );
};
