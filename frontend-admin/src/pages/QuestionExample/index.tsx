import { AgentKeyEnum, AgentKeyMap } from "@/constants/enums";
import {
  createQuestionExample,
  getPageByQuestionExample,
  removeQuestionExample,
  updateQuestionExample,
} from "@/services/steins-admin/aigcQuestionExampleController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button } from "antd";
import { useRef, useState } from "react";
import CreateQuestionModal from "./CreateQuestionModal";
import UpdateQuestionModal from "./UpdateQuestionModal";
export default function QuestionExamplePage() {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(20);
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<API.AigcQuestionExampleVo>();
  const updateQuestionStatus = async (questionId: string, mode: "on" | "off") => {
    const resp = await updateQuestionExample({
      questionId: questionId,
      status: mode === "on" ? 1 : 0,
    });
    handleResponse({
      resp,
      onSuccess: () => {
        Notify.ok("问题示例状态已更新");
        actionRef.current?.reload();
      },
      onError: () => {
        Notify.fail("问题示例状态更新失败：" + resp.msg);
      },
    });
  };
  const columns: ProColumns<API.AigcQuestionExampleVo>[] = [
    {
      title: "问题示例",
      dataIndex: "question",
      key: "question",
      align: "center",
      width: 440,
    },
    {
      title: "知识库分类",
      dataIndex: "agentKey",
      key: "agentKey",
      align: "center",
      render: (_, record) => {
        switch (record.agentKey) {
          case AgentKeyEnum.DATA:
            return <span>{AgentKeyMap[AgentKeyEnum.DATA]}</span>;
          case AgentKeyEnum.KNOWLEDGE:
            return <span>{AgentKeyMap[AgentKeyEnum.KNOWLEDGE]}</span>;
          default:
            return <span>未知类型</span>;
        }
      },
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
              setCurrentRecord(record);
              handleUpdateModalOpen(true);
            }}
          >
            更新
          </a>
          {record.status === 0 ? (
            <a onClick={() => updateQuestionStatus(record.questionId as string, "on")}>上线</a>
          ) : (
            <a onClick={() => updateQuestionStatus(record.questionId as string, "off")}>下线</a>
          )}
          <a
            onClick={async () => {
              const resp = await removeQuestionExample({
                questionId: record.questionId as string,
              });
              handleResponse({
                resp,
                onSuccess: () => {
                  Notify.ok("问题示例状态已删除");
                  actionRef.current?.reload();
                },
                onError: () => {
                  Notify.fail("问题示例删除失败：" + resp.msg);
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
      <ProTable<API.AigcQuestionExampleVo, API.GetPageQuestionExampleRequest>
        actionRef={actionRef}
        columns={columns}
        key={"questionId"}
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
          pageSize: pageSize, // 默认每页显示数量
          pageSizeOptions: ["10", "20", "50", "100"], // 可选的每页显示数量
          showSizeChanger: true, // 显示分页大小选择器
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
        request={async (params) => {
          const resp = await getPageByQuestionExample({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            question: params.question,
          });
          let tableData: API.AigcQuestionExampleVo[] = [];
          let total: number = 0;
          handleResponse({
            resp,
            onSuccess: (data) => {
              tableData = data.records || [];
              total = Number.parseInt(data.total || "0");
            },
            onError: () => {
              Notify.fail("获取问题示例数据失败:" + resp.msg);
            },
          });
          return {
            data: tableData,
            total: total,
            success: true,
          };
        }}
      ></ProTable>
      <CreateQuestionModal
        modalOpen={createModalOpen}
        handleModalOpen={handleCreateModalOpen}
        onSubmit={async (data: API.AddQuestionExampleRequest) => {
          const resp = await createQuestionExample(data);
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
      <UpdateQuestionModal
        modalOpen={updateModalOpen}
        handleModalOpen={handleUpdateModalOpen}
        onSubmit={async (data: API.UpdateQuestionExampleRequest) => {
          const resp = await updateQuestionExample(data);
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
    </div>
  );
}
