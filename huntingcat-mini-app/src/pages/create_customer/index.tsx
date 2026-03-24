
import { THEME_CONFIG } from "@/constant/global";
import { Button,Text, View } from "@tarojs/components";
import { useState, useEffect } from "react";
import "./index.scss";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { withGlobalLayout } from "@/components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import ValueBoxGenerator from "@/components/crm/ValueBoxGenerator";
import Taro from "@tarojs/taro";

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
  const router = Taro.useRouter();
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const dispatch = useDispatch<Dispatch>();
  const [createData, setCreateData] = useState<Record<string, string>>({});
  useEffect(() => {
 
  }, []);
  useEffect(() => {
    if (tableFields === undefined) {
      dispatch.crmModel.getCrmFields();
    }
  }, [router.path]);
  // 提交逻辑：组合原本的数据结构
  const handleSubmit = () => {
    console.log("提交的数据:", createData);
    // 这里执行你的 API 请求
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
            className="font-bold bg-transparent border-none flex-1"
            style={{ color: THEME_CONFIG.active }}
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
                          console.log("fieldKey:", fieldKey, "change val", val);
                          setCreateData(prev => ({
                            ...prev,
                            [fieldKey]: val
                          }))
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
