import { Tabs } from 'antd';
import React from 'react'

export default function CrmValueManagementPage() {
  
  return (
    <div>
       <Tabs
    defaultActiveKey="2"
    items={[0, 1].map((Icon, i) => {
      const id = String(i + 1);
      return {
        key: id,
        label: `Tab ${id}`,
        children: `Tab ${id}`,
      };
    })}
  />
    </div>
  )
}

const CrmValueTable:React.FC<{}> = () => {
  return (
    <>
    </>
  )
}