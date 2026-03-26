import { THEME_CONFIG } from "@/constant/global";
import { Button, Text, View } from "@tarojs/components";
import { useState, useEffect } from "react";
import "./index.scss";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { withGlobalLayout } from "@/components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import ValueBoxGenerator from "@/components/crm/ValueBoxGenerator";
import Taro from "@tarojs/taro";
import { insertEntityValue } from "@/services/steins-admin/crmEntityValueController";
import { handleResponse, Notify } from "@/utils/common";
import { ROUTERS } from "@/constant/menus";
const GROUP_INFO = {
  基本信息: [
    "customer_name",
    "contract_name",
    "contract_phone",
    "job_title",
    "origin_addr",
  ],
  项目基本信息: [
    "project_name",
    "region",
    "detail_addr",
    "cooperate_type",
    "customer_type",
    "customer_category",
    "customer_source",
  ],
  备注: ["remark"],
};
function CreateCustomerPage() {
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo);
  const dispatch = useDispatch<Dispatch>();
  const [createData, setCreateData] = useState<Record<string, string>>({});
 
  // 提交逻辑：组合原本的数据结构
  const handleSubmit = async () => {
    console.log("提交的数据:", createData,entityVo);
    let errorMsg = validateValue();
    if (errorMsg) {
      Notify.fail(errorMsg);
      return;
    }
    const resp = await insertEntityValue({
      entityId: entityVo.entityId,
      data: [
        {
          customerName: createData["customer_name"],
          remark: createData["remark"],
          values: JSON.stringify(createData),
        },
      ],
    });
    handleResponse({
      resp,
      onSuccess: () => {
        Notify.ok("创建成功!");
        dispatch.routerModel.switchTab({url: ROUTERS.customer})
      },
      onError: () => {
        Notify.fail("创建失败:" + resp.msg);
      },
    });
  };
  const validateValue = () => {
    let errorMsg = "";

    Object.values(GROUP_INFO).forEach((fields) => {
      if (errorMsg) {
        return;
      }
      for (let field of fields) {
        let idx = tableFields.findIndex((it) => it.fieldKey === field);
        if (idx === -1) {
          errorMsg = `【${field}】字段找不到`;
          return
        }
        let fieldName = tableFields[idx].fieldName;
        let isRequired = tableFields[idx].isRequired;
        if (isRequired && !createData?.[field]) {
          errorMsg = `【${fieldName}】为必填项`;
          return;
        }
      }
    });
    return errorMsg;
  };
  return (
    <HeaderBodyFooterLayout
      FooterRender={
        <View className="w-full flex items-center">
          <Button className="text-gray-500 bg-transparent border-none flex-1">
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="font-bold bg-transparent border-none flex-1 text-active"
          >
            确认提交
          </Button>
        </View>
      }
    >
      <>
        {/* 头部：保持原本的 UI */}
        <View className="flex justify-between items-center p-4">
          <Text className="text-lg font-bold text-gray-800">创建客户</Text>
        </View>

        <View className="space-y-6 px-4 pb-4">
          {Object.entries(GROUP_INFO).map(([key, value], index) => {
            return (
              <View key={index}>
                <View className="flex items-center gap-2 mb-3">
                  <View className="w-1 h-4 bg-amber-400 rounded-full" />
                  <Text className="font-bold text-gray-700">{key}</Text>
                </View>
                <View className="bg-white rounded-lg overflow-hidden border border-gray-100">
                  {value.map((fieldKey) => {
                    let idx = tableFields.findIndex(
                      (it) => it.fieldKey === fieldKey,
                    );
                    if (idx === -1) {
                      return null;
                    }
                    return (
                      <ValueBoxGenerator
                        key={fieldKey}
                        field={tableFields[idx]}
                        value={createData[fieldKey]}
                        onChange={(val: any) => {
                          setCreateData((prev) => ({
                            ...prev,
                            [fieldKey]: val,
                          }));
                        }}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </>
    </HeaderBodyFooterLayout>
  );
}
export default withGlobalLayout(CreateCustomerPage);
