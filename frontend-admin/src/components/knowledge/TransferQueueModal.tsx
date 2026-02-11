import React from "react";
import { Modal, Table, Progress, Button } from "antd";
import { FileText, FileImage, FileSpreadsheet } from "lucide-react";
import type { ColumnsType } from "antd/es/table";

export type TransferStatus = "waiting" | "uploading" | "success" | "error";

export type TransferItem = {
  id: string;
  name: string;
  path: string;
  size: string;
  status: TransferStatus;
  progress: number;
  file: File;
};

type TransferQueueModalProps = {
  open: boolean;
  onClose: () => void;
  items: TransferItem[];
};

const getFileIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf") || lower.endsWith(".docx") || lower.endsWith(".doc")) {
    return <FileText size={16} className="text-blue-500" />;
  }
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return <FileImage size={16} className="text-purple-500" />;
  }
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    return <FileSpreadsheet size={16} className="text-emerald-500" />;
  }
  return <FileText size={16} className="text-gray-500" />;
};

const renderStatus = (status: TransferStatus, progress: number) => {
  switch (status) {
    case "waiting":
      return <span className="text-gray-400 text-sm">等待中</span>;
    case "uploading":
      return (
        <div className="flex items-center gap-2 min-w-[100px]">
          <span className="text-blue-500 text-sm whitespace-nowrap">处理中({progress}%)</span>
          <Progress
            percent={progress}
            size="small"
            showInfo={false}
            strokeColor="#3b82f6"
            className="flex-1 [&_.ant-progress-inner]:!h-1.5"
          />
        </div>
      );
    case "success":
      return <span className="text-emerald-500 text-sm">已完成</span>;
    case "error":
      return <span className="text-red-500 text-sm">失败</span>;
    default:
      return null;
  }
};

const TransferQueueModal: React.FC<TransferQueueModalProps> = ({
  open,
  onClose,
  items,
}) => {
  const columns: ColumnsType<TransferItem> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (name: string) => (
        <div className="flex items-center gap-2">
          {getFileIcon(name)}
          <span className="text-sm text-gray-700 truncate max-w-[220px]">{name}</span>
        </div>
      ),
    },
    {
      title: "路径",
      dataIndex: "path",
      key: "path",
      width: 200,
      render: (path: string) => (
        <span className="text-sm text-gray-500 truncate block max-w-[180px]">{path}</span>
      ),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: 80,
      render: (size: string) => <span className="text-sm text-gray-500">{size}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 160,
      render: (_, record) => renderStatus(record.status, record.progress),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="传输队列"
      footer={
        <Button onClick={onClose}>关闭</Button>
      }
      width={800}
      centered
      styles={{
        body: { padding: "16px 0" },
      }}
    >
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ y: 300 }}
        locale={{ emptyText: "暂无传输任务" }}
      />
    </Modal>
  );
};

export default TransferQueueModal;
