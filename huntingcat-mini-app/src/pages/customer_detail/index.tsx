import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { AtIcon, AtTag } from "taro-ui";
import { THEME_CONFIG } from "@/constant/global";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { withGlobalLayout } from "@/components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { findSelectedNodes } from "@/utils/region";

function CustomerDetailPage() {
  const dispatch = useDispatch<Dispatch>()
  const selectedEntityValue = useSelector((state:RootState) => state.crmModel.selectedEntityValue)
  const valueObject = JSON.parse(selectedEntityValue.values)

  return (
    <HeaderBodyFooterLayout
      FooterRender={
        <View className="w-full p-4 bg-white/80 backdrop-blur-md flex gap-4">
          <View className="flex-1 py-3 bg-white border border-gray-200 rounded-full text-center text-sm font-bold text-gray-600 active:bg-gray-100">
            编辑信息
          </View>
          <View
            className="bg-active flex-1 py-3 rounded-full text-center text-sm font-bold text-white shadow-lg active:opacity-80"
            onClick={() =>
              Taro.makePhoneCall({ phoneNumber: valueObject["contract_phone"] })
            }
          >
            立即联系
          </View>
        </View>
      }
    >
      <>
        {/* 顶部 Header：公司大标题 */}
        <View className="p-6">
          <View className="flex justify-between items-start">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                {valueObject["customer_name"]}
              </Text>
              <View className="flex gap-2 mt-2">
                {/* <AtTag size="small" circle active type="primary">
                  {info.tag}
                </AtTag> */}
                {/* <AtTag size="small" circle>
                  常规客户
                </AtTag> */}
              </View>
            </View>
            <View className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
              <AtIcon value="user" size="24" color={THEME_CONFIG.active} />
            </View>
          </View>
        </View>

        <View className="px-4 space-y-4">
          {/* Section: 基本信息 */}
          <DetailSection title="基本信息" iconColor="bg-amber-400">
            <InfoRow label={dispatch.crmModel.getFieldName("contract_name")} value={valueObject["contract_name"]} />
            <InfoRow
              label={dispatch.crmModel.getFieldName("contract_phone")}
              value={valueObject["contract_phone"]}
              isLink
              color="text-blue-600"
              onClick={() =>
                Taro.makePhoneCall({ phoneNumber: valueObject["contract_phone"] })
              }
            />
            <InfoRow label={dispatch.crmModel.getFieldName("job_title")} value={valueObject["job_title"]} />
            <InfoRow
              label="籍贯"
              value={valueObject["origin_addr"]}
              border={false}
            />
          </DetailSection>

          {/* Section: 项目基本信息 */}
          <DetailSection title="项目基本信息" iconColor="bg-blue-400">
            <InfoRow
              label={dispatch.crmModel.getFieldName("project_name")}
              value={valueObject["project_name"]}
            />
            <InfoRow
              label={dispatch.crmModel.getFieldName("region")}
              value={findSelectedNodes(valueObject["region"])}
            />
            <InfoRow
              label={dispatch.crmModel.getFieldName("detail_addr")}
              value={valueObject["detail_addr"]}
            />
            <InfoRow
              label={dispatch.crmModel.getFieldName("cooperate_type")}
              value={valueObject["cooperate_type"]}
            />
            <InfoRow label={dispatch.crmModel.getFieldName("customer_type")} value={valueObject["customer_type"]} />
            <InfoRow
              label={dispatch.crmModel.getFieldName("customer_source")}
              value={valueObject["customer_source"]}
              border={false}
            />
          </DetailSection>

          {/* Section: 备注 */}
          <DetailSection title={dispatch.crmModel.getFieldName("remark")} iconColor="bg-green-400">
            <View className="p-3 bg-gray-50/50 rounded-lg">
              <Text className="text-sm text-gray-600 leading-relaxed">
                {valueObject["remark"] || "暂无备注信息..."}
              </Text>
            </View>
          </DetailSection>
        </View>
      </>
    </HeaderBodyFooterLayout>
  );
}

/** 详情区块容器 */
const DetailSection = ({ title, iconColor, children }) => (
  <View className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/50">
    <View className="flex items-center gap-2 mb-4">
      <View className={`w-1 h-4 ${iconColor} rounded-full`} />
      <Text className="font-bold text-gray-800 text-sm">{title}</Text>
    </View>
    <View>{children}</View>
  </View>
);

/** 详情行组件 */
const InfoRow = ({
  label,
  value,
  isLink = false,
  color = "text-gray-700",
  border = true,
  onClick = () => {},
}) => (
  <View
    className={`flex py-3 ${border ? "border-b border-gray-100/50" : ""}`}
    onClick={onClick}
  >
    <Text className="w-24 text-sm text-gray-400 flex-shrink-0">{label}</Text>
    <View className="flex-1 flex items-center justify-end">
      <Text className={`text-sm font-medium text-right ${color}`}>
        {value || "-"}
      </Text>
      {isLink && <AtIcon value="chevron-right" size="14" color="#999" />}
    </View>
  </View>
);

export default withGlobalLayout(CustomerDetailPage);
