import { getFieldsByEntityId } from "@/services/steins-admin/crmEntityFieldController";
import { handleResponse, Notify } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm, Select } from "antd";
import { RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type ModalProps = {
  modalOpen: boolean;
  handleModalOpen: any;
  value: API.CrmEntityVo | undefined;
  onSubmit: (fieldValues: API.UpsertCrmEntityFieldRequest) => Promise<void>;
};
const INIT_FIELD = {
  id: 1,
  fieldKey: "customer_name",
  fieldName: "客户名称",
  dataType: 1,
  isRequired: true,
  sortOrder: 0,
};
export default function ConfigureFieldModal({ modalOpen, handleModalOpen, onSubmit, value }: ModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [fieldDataLoading, setFieldDataLoading] = useState<boolean>(false);

  const [formRef] = Form.useForm();
  useEffect(() => {
    if (modalOpen && value) {
      refreshEntityValue().then((data) => {
        formRef.setFieldsValue({ customers: [INIT_FIELD, ...data] });
      });
    } else if (!modalOpen) {
      formRef.resetFields();
    }
  }, [modalOpen, value]);
  const refreshEntityValue = async () => {
    setFieldDataLoading(true);
    let result: API.CrmEntityFieldVo[] = [];
    const resp = await getFieldsByEntityId({
      entityId: value?.entityId,
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
    formRef.setFieldsValue({ customers: [INIT_FIELD, ...data] });
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
            fields: data.customers.slice(1).map((it: any) => {
              return {
                ...it,
                id: it.id || null,
                options: it.options || "",
                isRequired: Boolean(it.isRequired),
                sortOrder: Number.parseInt(it.sortOrder)
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
        <Button onClick={() => Notify.fail("功能暂未开发")}>回收站</Button>
        <div className="w-full h-[70vh] overflow-y-auto custom-scrollbar p-1">
          <Form
            form={formRef}
            name="dynamic_form_nest_item"
            autoComplete="off"
            initialValues={{
              customers: [INIT_FIELD],
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
                            <Input placeholder="填写字段中文描述" disabled={name === 0} />
                          </Form.Item>
                          <Form.Item className="flex-1" name={[name, "fieldKey"]} rules={[{ required: true, message: "缺少字段key" }]}>
                            <Input placeholder="填写字段key（仅限英文）" disabled={Boolean(fieldId)} />
                          </Form.Item>

                          <Form.Item className="flex-1" name={[name, "dataType"]} initialValue={1} rules={[{ required: true, message: "数据类型" }]}>
                            <Select
                              disabled={Boolean(fieldId)}
                              options={[
                                {
                                  label: "文本",
                                  value: 1,
                                },
                                {
                                  label: "数字",
                                  value: 2,
                                },
                                {
                                  label: "布尔",
                                  value: 3,
                                },
                                {
                                  label: "选择器",
                                  value: 4,
                                },
                                 {
                                  label: "日期",
                                  value: 5,
                                },
                                {
                                  label: "行政区划",
                                  value: 6,
                                }
                              ]}
                            />
                          </Form.Item>
                          <Form.Item
                            className="flex-1 h-0"
                            shouldUpdate={(prevValues, curValues) => {
                              return prevValues.customers?.[name]?.dataType !== curValues.customers?.[name]?.dataType;
                            }}
                          >
                            {({ getFieldValue }) => {
                              const dataType = getFieldValue(["customers", name, "dataType"]);
                              return dataType === 4 ? (
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
                              disabled={name === 0}
                            />
                          </Form.Item>
                          <Form.Item className="flex-1" name={[name, "sortOrder"]} initialValue={name} rules={[{ required: true, message: "排列顺序" }]}>
                            <Input type="number" disabled={name === 0} />
                          </Form.Item>
                          <Form.Item>
                            <div className="w-5">
                              {name !== 0 && (
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
    </Modal>
  );
}
