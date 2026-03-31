import { getDeletedFieldsByEntityId, getFieldsByEntityId, restoreField } from "@/services/steins-admin/crmEntityFieldController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm, Select, Table, Tag } from "antd";
import { RefreshCw, Trash2, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { CrmDataTypeEnum } from "@/constants/enums";

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.CrmEntityVo | undefined;
  onSubmit: (fieldValues: API.UpsertCrmEntityFieldRequest) => Promise<void>;
};
const INIT_FIELD = [
  {
    id: null,
    fieldKey: "customer_name",
    fieldName: "客户名称",
    dataType: "text",
    isRequired: true,
    sortOrder: 0,
  },
  {
    id: null,
    fieldKey: "remark",
    fieldName: "备注",
    dataType: "textarea",
    isRequired: false,
    sortOrder: 0,
  },
];

const DATA_TYPE_OPIONS = [
  {
    label: "文本",
    value: "text",
  },
   {
    label: "多行文本",
    value: "textarea",
  },
  {
    label: "数字",
    value: "number",
  },
  {
    label: "布尔",
    value: "bool",
  },
  {
    label: "选择器",
    value: "picker",
  },
  {
    label: "日期",
    value: "date",
  },
  {
    label: "行政区划",
    value: "region",
  },
    {
    label: "定位",
    value: "location",
  },
];
export default function ConfigureFieldModal({ modalOpen, handleModalOpen, onSubmit, value }: ModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [fieldDataLoading, setFieldDataLoading] = useState<boolean>(false);
  const [recycleBinOpen, setRecycleBinOpen] = useState<boolean>(false);
  const [deletedFields, setDeletedFields] = useState<API.CrmEntityFieldVo[]>([]);
  const [recycleBinLoading, setRecycleBinLoading] = useState<boolean>(false);

  const [formRef] = Form.useForm();
  useEffect(() => {
    if (modalOpen && value) {
      refreshEntityValue().then((data) => {
        if (data.length === 0) {
          formRef.setFieldsValue({ customers: INIT_FIELD });
        } else {
          formRef.setFieldsValue({ customers: data });
        }
      });
    } else if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen, value]);
  const refreshEntityValue = async () => {
    setFieldDataLoading(true);
    let result: API.CrmEntityFieldVo[] = [];
    const resp = await getFieldsByEntityId({
      entityId: value?.entityId as string,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        result = data;
      },
      onError: () => {
        Notify.fail("客户表字段数据查询失败:" + resp.msg);
      },
      onFinish: () => {
        setFieldDataLoading(false);
      },
    });
    return result;
  };
  const resetEntityValue = async () => {
    const data = await refreshEntityValue();
    if (data.length === 0) {
      formRef.setFieldsValue({ customers: INIT_FIELD });
    } else {
      formRef.setFieldsValue({ customers: data });
    }
  };

  const getDeletedFields = async () => {
    setRecycleBinLoading(true);
    const resp = await getDeletedFieldsByEntityId({
      entityId: value?.entityId,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setDeletedFields(data);
      },
      onError: () => {
        Notify.fail("获取已删除字段失败:" + resp.msg);
      },
      onFinish: () => {
        setRecycleBinLoading(false);
      },
    });
  };

  const handleRestoreField = async (fieldId: string) => {
    const resp = await restoreField({
      fieldId: fieldId,
    });
    handleResponse({
      resp,
      onSuccess: () => {
        Notify.ok("字段恢复成功");
        // 刷新已删除字段列表
        getDeletedFields();
        // 刷新当前字段列表
        resetEntityValue();
      },
      onError: () => {
        Notify.fail("字段恢复失败:" + resp.msg);
      },
    });
  };
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span>创建客户实体字段</span>
          <span className="flex items-center gap-1 p-2 border rounded-xl text-xs hover:bg-gray-200 cursor-pointer" onClick={resetEntityValue}>
            <RefreshCw className="h-4 w-4" />
            重置
          </span>
        </div>
      }
      open={modalOpen}
      closable={false}
      className=""
      centered
      width={"90%"}
      confirmLoading={btnLoading}
      destroyOnHidden
      onCancel={() => handleModalOpen(false)}
      onOk={async () => {
        setBtnLoading(true);
        try {
          const data = await formRef.validateFields();
          await onSubmit({
            entityId: value?.entityId as string,
            fields: data.customers.map((it: any) => {
              return {
                ...it,
                id: it.id || null,
                options: it.options || "",
                isRequired: Boolean(it.isRequired),
                sortOrder: Number.parseInt(it.sortOrder),
              };
            }),
          });
        } finally {
          setBtnLoading(false);
        }
        // await onSubmit(data);
      }}
    >
      <div>
        <Button 
          onClick={() => {
            setRecycleBinOpen(true);
            getDeletedFields();
          }}
        >
          回收站
        </Button>
        <div className="w-full h-[70vh] overflow-y-auto custom-scrollbar p-1">
          <Form
            form={formRef}
            name="dynamic_form_nest_item"
            autoComplete="off"
            initialValues={{
              customers: [...INIT_FIELD],
            }}
          >
            <Form.List name="customers">
              {(fields, { add, remove }) => {
                return (
                  <div className="">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className="flex-1 text-gray-500 font-medium text-center">字段名称</div>
                      <div className="flex-1 text-gray-500 font-medium text-center">字段Key</div>
                      <div className="flex-1 text-gray-500 font-medium text-center">数据类型</div>
                      <div className="flex-1 text-gray-500 font-medium text-center">选项配置</div>
                      <div className="flex-1 text-gray-500 font-medium text-center">是否必填</div>
                      <div className="flex-1 text-gray-500 font-medium text-center">排列顺序</div>
                    </div>
                    {fields.map(({ key, name, ...restField }) => {
                      const fieldId = formRef.getFieldValue(["customers", name, "id"]);
                      return (
                        <div className="flex gap-2 mb-2 px-1" key={key}>
                          <Form.Item name={[name, "id"]} hidden>
                            <Input />
                          </Form.Item>
                          <Form.Item className="flex-1" name={[name, "fieldName"]} rules={[{ required: true, message: "缺少字段中文名" }]}>
                            <Input placeholder="填写字段中文描述" />
                          </Form.Item>
                          <Form.Item className="flex-1" name={[name, "fieldKey"]} rules={[{ required: true, message: "缺少字段key" }]}>
                            <Input placeholder="填写字段key（仅限英文）" disabled={INIT_FIELD.map((_, idx) => idx).includes(name) || Boolean(fieldId)} />
                          </Form.Item>

                          <Form.Item className="flex-1" name={[name, "dataType"]} initialValue={"text"} rules={[{ required: true, message: "数据类型" }]}>
                            <Select disabled={INIT_FIELD.map((_, idx) => idx).includes(name) || Boolean(fieldId)} options={DATA_TYPE_OPIONS} />
                          </Form.Item>
                          <Form.Item
                            className="flex-1 h-0"
                            shouldUpdate={(prevValues, curValues) => {
                              return prevValues.customers?.[name]?.dataType !== curValues.customers?.[name]?.dataType;
                            }}
                          >
                            {({ getFieldValue }) => {
                              const dataType = getFieldValue(["customers", name, "dataType"]);
                              return dataType === CrmDataTypeEnum.Picker ? (
                                <Form.Item {...restField} name={[name, "options"]} rules={[{ required: true, message: "请输入选项内容" }]}>
                                  <Input placeholder="选项(用逗号隔开，如: A,B,C)" />
                                </Form.Item>
                              ) : (
                                <div className="text-gray-300 text-xs italic py-2 text-center">无需配置</div>
                              );
                            }}
                          </Form.Item>
                          <Form.Item className="flex-1" initialValue={true} name={[name, "isRequired"]} rules={[{ required: true, message: "是否必填" }]}>
                            <Select
                              options={[
                                {
                                  label: "是",
                                  value: true,
                                },
                                {
                                  label: "否",
                                  value: false,
                                },
                              ]}
                              disabled={INIT_FIELD.map((_, idx) => idx).includes(name)}
                            />
                          </Form.Item>
                          <Form.Item className="flex-1" name={[name, "sortOrder"]} initialValue={name - 1} rules={[{ required: true, message: "排列顺序" }]}>
                            <Input type="number" disabled={INIT_FIELD.map((_, idx) => idx).includes(name)}/>
                          </Form.Item>
                          <Form.Item>
                            <div className="w-5">
                              {!INIT_FIELD.map((_, idx) => idx).includes(name) && (
                                <Popconfirm
                                  title="二次确认删除"
                                  description="是否删除该字段？"
                                  onConfirm={() => {
                                    remove(name);
                                  }}
                                >
                                  <Trash2 className="w-full h-full" />
                                </Popconfirm>
                              )}
                            </div>
                          </Form.Item>
                        </div>
                      );
                    })}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        新增字段
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </Form>
        </div>
      </div>

      {/* 回收站弹窗 */}
      <Modal
        title="字段回收站"
        open={recycleBinOpen}
        onCancel={() => setRecycleBinOpen(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setRecycleBinOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        <Table
          loading={recycleBinLoading}
          dataSource={deletedFields}
          rowKey="id"
          columns={[
            {
              title: "字段名称",
              dataIndex: "fieldName",
              key: "fieldName",
            },
            {
              title: "字段Key",
              dataIndex: "fieldKey",
              key: "fieldKey",
            },
            {
              title: "数据类型",
              dataIndex: "dataType",
              key: "dataType",
              render: (dataType: number) => {
                const typeMap:Record<number, string> = {
                  1: "文本",
                  2: "数字",
                  3: "布尔",
                  4: "选择器",
                  5: "日期",
                  6: "行政区划",
                };
                return typeMap[dataType] || "未知";
              },
            },
            {
              title: "是否必填",
              dataIndex: "isRequired",
              key: "isRequired",
              render: (isRequired: boolean) => {
                return isRequired ? (
                  <Tag color="green">是</Tag>
                ) : (
                  <Tag color="gray">否</Tag>
                );
              },
            },
            {
              title: "排列顺序",
              dataIndex: "sortOrder",
              key: "sortOrder",
            },
            {
              title: "操作",
              key: "action",
              render: (_, record: API.CrmEntityFieldVo) => (
                <Button
                  type="primary"
                  size="small"
                  icon={<RotateCw className="h-4 w-4" />}
                  onClick={() => handleRestoreField(record.id as string)}
                >
                  恢复
                </Button>
              ),
            },
          ]}
          pagination={{
            pageSize: 10,
          }}
        />
      </Modal>
    </Modal>
  );
}
