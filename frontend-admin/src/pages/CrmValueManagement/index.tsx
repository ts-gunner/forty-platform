import { getEntityList } from '@/services/steins-admin/crmEntityController';
import { handleResponse, Notify } from '@/utils/common';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react'

export default function CrmValueManagementPage() {
  const [entityData, setEntityData] = useState<API.CrmEntityVo[]>([])
  useEffect(() => {
    getEntities()
  }, [])
  const getEntities = async () => {
    const resp = await getEntityList({
      pageNum: 1,
      pageSize: 999,
    });

    handleResponse({
      resp,
      onSuccess: (data) => {
        setEntityData(data.list || []);
      },
      onError: () => {
        Notify.fail("获取实体列表数据失败:" + resp.msg);
      },
    });
  }
  return (
    <div>
      <Tabs
        defaultActiveKey={entityData?.[0]?.entityId}
        items={entityData.map((it, i) => {
          const id = String(i + 1);
          return {
            key: it.entityId as string,
            label: it.entityName,
            children: <CrmValueTable entity={it}/>,
          };
        })}
      />
    </div>
  )
}

const CrmValueTable: React.FC<{entity: API.CrmEntityVo}> = ({entity}) => {
  return (
    <>
    </>
  )
}