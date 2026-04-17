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
const CURRENT_PAGE = ROUTERS.createCustomer;

function CreateCustomerPage() {
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo);
  const dispatch = useDispatch<Dispatch>();
  const [createData, setCreateData] = useState<Record<string, string>>({});

  // 提交逻辑：组合原本的数据结构
  const handleSubmit = async () => {
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
        dispatch.routerModel.switchTab({ url: ROUTERS.customer });
      },
      onError: () => {
        Notify.fail("创建失败:" + resp.msg);
      },
    });
  };
  const validateValue = () => {
    let errorMsg = "";

    tableFields.forEach((field) => {
      if (errorMsg) {
        return;
      }
      if (field.isRequired && !createData?.[field.fieldKey]) {
        errorMsg = `【${field.fieldName}】为必填项`;
        return;
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
          {tableFields.map((field, index) => {
            return (
              <View key={index}>
                <ValueBoxGenerator
                  key={field.fieldKey}
                  field={field}
                  value={createData?.[field.fieldKey]}
                  onChange={(val: any) => {
                    setCreateData((prev) => ({
                      ...prev,
                      [field.fieldKey]: val,
                    }));
                  }}
                />
              </View>
            );
          })}
        </View>
      </>
    </HeaderBodyFooterLayout>
  );
}
export default withGlobalLayout(CreateCustomerPage);
