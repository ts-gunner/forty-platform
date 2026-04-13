import { getAuditList, updateAudit } from "@/services/steins-admin/auditController";
import { handleResponse, Notify } from "@/utils/common";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Input, Popover, Space } from "antd";
import { useRef, useState } from "react";

const AuditManagePage = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [open, setOpen] = useState(false);

  const columns: ProColumns<API.AuditAccessRecordVo>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      hideInSearch: true,
    },
    {
      title: "业务类型",
      dataIndex: "bizType",
      key: "bizType",
      align: "center",
    },
    {
      title: "业务描述",
      dataIndex: "bizDesc",
      key: "bizDesc",
      align: "center",
      hideInSearch: true,
    },
    {
      title: "审核代码",
      dataIndex: "auditCode",
      key: "auditCode",
      align: "center",
      hideInSearch: true,
    },
    {
      title: "申请人名称",
      dataIndex: "applyUser",
      key: "applyUser",
      align: "center",
      hideInSearch: true,
    },
    {
      title: "申请人备注",
      dataIndex: "applyRemark",
      key: "applyRemark",
      align: "center",
      hideInSearch: true,
    },
    {
      title: "审核状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      valueType: "select",
      valueEnum: {
        0: { text: "待审核", status: "Info" },
        1: { text: "审核成功", status: "Success" },
        2: { text: "审核失败", status: "Error" },
      },
    },
    {
      title: "审核备注",
      dataIndex: "remark",
      key: "remark",
      align: "center",
      hideInSearch: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "center",
      hideInSearch: true,
      render: (_, record) => {
        return (
          record.status === 0 && (
            <div className="flex justify-center items-center gap-3">
              <Button className="bg-green-600! text-white! font-bold! hover:bg-green-700!" onClick={() => approveAccess(true, record.id || "", "")}>
                通过
              </Button>
              <Popover
                content={<PopoverContent auditId={record.id || ""} />}
                trigger="click"
                open={open}
                onOpenChange={setOpen}
                placement="top"
                title="请填写内容"
              >
                <Button className="bg-red-400! text-white! font-bold! hover:bg-red-600!">不通过</Button>
              </Popover>
            </div>
          )
        );
      },
    },
  ];

  const approveAccess = async (result: boolean, auditId: string, remark: string) => {
    const resp = await updateAudit({
      id: auditId,
      status: result ? 1 : 2,
      remark: remark,
    });
    handleResponse({
      resp,
      onSuccess: () => {
        Notify.ok("审核成功!");
        actionRef.current?.reload();
      },
      onError: () => {
        Notify.fail("审核失败：" + resp.msg);
      },
    });
  };
  const PopoverContent = ({ auditId }: { auditId: string }) => {
    const [inputValue, setInputValue] = useState("");

    return (
      <div style={{ width: 240 }}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入内容"
          style={{ marginBottom: 10 }}
          onPressEnter={() => {
            approveAccess(false, auditId, inputValue);
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              approveAccess(false, auditId, inputValue);
            }}
            size="small"
          >
            确认
          </Button>
          <Button onClick={() => setOpen(false)} size="small">
            取消
          </Button>
        </Space>
      </div>
    );
  };
  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        key={"id"}
        request={async (params) => {
          const resp = await getAuditList({
            pageNum: params.current,
            pageSize: params.pageSize,
            status: params.status,
          });
          let tableData: API.AuditAccessRecordVo[] = [];
          let total = 0;
          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.list || [];
              total = data.total || 0;
            },
            onError: () => {
              Notify.fail(resp.msg || "");
            },
            onFinish: () => {},
          });

          return {
            data: tableData,
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
    </div>
  );
};

export default AuditManagePage;
