import React, { useEffect, useRef, useState } from "react";
import { Table, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";

export type FileListItem = {
  id: string;
  name: string;
  typeLabel: string;
  typeClassName: string;
  icon: React.ReactNode;
  size: string;
  updatedAt: string;
  nodeId?: string;
  nodeType?: string;
};

type FileListTableProps = {
  items: FileListItem[];
  footerText?: string;
  footerIcon?: React.ReactNode;
  onFolderClick?: (item: FileListItem) => void;
  onFileDownload?: (item: FileListItem) => Promise<string | null>;
  loading?: boolean;        // 首次加载状态
  loadingMore?: boolean;   // 加载更多状态
  onLoadMore?: () => void; // 懒加载触发
  hasMore?: boolean;       // 是否还有更多
};

type ContextMenuState = {
  x: number;
  y: number;
  item: FileListItem;
} | null;

const FileListTable: React.FC<FileListTableProps> = ({
  items,
  footerText,
  footerIcon,
  onFolderClick,
  onFileDownload,
  loading,
  loadingMore = false,
  onLoadMore,
  hasMore = true,
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tableBodyRef = useRef<HTMLDivElement | null>(null);

  const columns: ColumnsType<FileListItem> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: "38%",
      render: (_, file) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
            {file.icon}
          </div>
          <span className="text-slate-700">{file.name}</span>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "typeLabel",
      key: "typeLabel",
      width: "18%",
      render: (_, file) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${file.typeClassName}`}
        >
          {file.typeLabel}
        </span>
      ),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: "14%",
    },
    {
      title: "最后修改",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "18%",
    },
    {
      title: "操作",
      key: "action",
      width: "12%",
      render: () => <span className="text-slate-400">···</span>,
    },
  ];

  const footer = footerText
    ? () => (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {footerIcon}
          {footerText}
        </div>
      )
    : undefined;

  useEffect(() => {
    if (!contextMenu) return;
    const handleClose = () => setContextMenu(null);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContextMenu(null);
    };
    window.addEventListener("click", handleClose);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [contextMenu]);

  const getMimeType = (fileName: string) => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".pdf")) return "application/pdf";
    if (lower.endsWith(".docx"))
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (lower.endsWith(".xlsx"))
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (lower.endsWith(".png")) return "image/png";
    return "application/octet-stream";
  };

  const handleDownload = async (item: FileListItem) => {
    if (onFileDownload) {
      const url = await onFileDownload(item);
      if (url) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = item.name || "download";
        anchor.rel = "noopener noreferrer";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        return;
      }
    }
    const fileName = item.name || "download.txt";
    const blob = new Blob([`模拟下载内容：${fileName}`], {
      type: getMimeType(fileName),
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  // 监听 Table 内部滚动容器的滚动事件
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    let scrollContainer: HTMLElement | null = null;
    let retryCount = 0;
    const maxRetries = 10;

    // 查找 Table 内部的滚动容器
    const findScrollContainer = () => {
      if (!containerRef.current) return null;
      // Ant Design Table 的滚动容器通常是 .ant-table-body
      const tableBody = containerRef.current.querySelector('.ant-table-body');
      return tableBody as HTMLElement | null;
    };

    const handleScroll = () => {
      if (loading || loadingMore || !hasMore || !scrollContainer) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // 当滚动到距离底部50px时触发加载更多
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        onLoadMore();
      }
    };

    // 尝试查找滚动容器，如果找不到则重试
    const tryAttachListener = () => {
      scrollContainer = findScrollContainer();
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
        return true;
      }
      return false;
    };

    // 立即尝试一次
    if (!tryAttachListener()) {
      // 如果找不到，使用 MutationObserver 监听 DOM 变化
      const observer = new MutationObserver(() => {
        if (tryAttachListener()) {
          observer.disconnect();
        } else {
          retryCount++;
          if (retryCount >= maxRetries) {
            observer.disconnect();
          }
        }
      });

      if (containerRef.current) {
        observer.observe(containerRef.current, {
          childList: true,
          subtree: true,
        });
      }

      // 延迟检查，确保 Table 已渲染
      const timer = setTimeout(() => {
        if (!scrollContainer) {
          tryAttachListener();
        }
        observer.disconnect();
      }, 500);

      return () => {
        clearTimeout(timer);
        observer.disconnect();
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
      };
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onLoadMore, hasMore, loading, loadingMore, items.length]);

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-auto"
    >
      <Table
        className="file-list-table rounded-3xl border border-slate-200 bg-white shadow-sm"
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ y: 800 }} // 设置表格滚动高度，确保有滚动条
        rowClassName={(record) =>
          record.nodeType === "folder" ? "cursor-pointer" : ""
        }
        onRow={(record) => ({
          onDoubleClick: () => {
            if (record.nodeType === "folder") {
              onFolderClick?.(record);
            }
          },
          onContextMenu: (event) => {
            if (record.nodeType === "folder") return;
            event.preventDefault();
            event.stopPropagation();
            setContextMenu({
              x: event.clientX,
              y: event.clientY,
              item: record,
            });
          },
        })}
        footer={footer}
      />

      {/* 只在加载更多时显示底部的加载指示器 */}
      {loadingMore && hasMore && (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      )}

      {contextMenu && (
        <div
          className="fixed z-50 min-w-[120px] rounded-lg border border-slate-200 bg-white shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
            onClick={() => {
              handleDownload(contextMenu.item);
              setContextMenu(null);
            }}
          >
            下载
          </button>
        </div>
      )}
    </div>
  );
};

export default FileListTable;
