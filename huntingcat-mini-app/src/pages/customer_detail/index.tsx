import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { AtIcon, AtTag } from "taro-ui";
import { CUSTOMER_INFO_LIST } from "../../constant/mock";
import { THEME_CONFIG } from "../../constant/global";
import HeaderBodyFooterLayout from "../../components/layout/HeaderFooterLayout";

function CustomerDetailPage() {
  const router = useRouter();
  const { id } = router.params;
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    // 实际开发中根据 ID 请求 API
    const data =
      CUSTOMER_INFO_LIST.find((item) => item.key === id) ||
      CUSTOMER_INFO_LIST[0];
    setInfo(data);
    Taro.setNavigationBarTitle({ title: data?.companyName || "客户详情" });
  }, [id]);

  if (!info) return null;

  return (
    <HeaderBodyFooterLayout
      FooterRender={
        <View className="w-full p-4 bg-white/80 backdrop-blur-md flex gap-4">
          <View className="flex-1 py-3 bg-white border border-gray-200 rounded-full text-center text-sm font-bold text-gray-600 active:bg-gray-100">
            编辑信息
          </View>
          <View
            className="flex-1 py-3 rounded-full text-center text-sm font-bold text-white shadow-lg active:opacity-80"
            style={{ backgroundColor: THEME_CONFIG.active }}
            onClick={() =>
              Taro.makePhoneCall({ phoneNumber: info.contractPhone })
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
                {info.companyName}
              </Text>
              <View className="flex gap-2 mt-2">
                <AtTag size="small" circle active type="primary">
                  {info.tag}
                </AtTag>
                <AtTag size="small" circle>
                  {info.projectInfo?.customerCategory || "常规客户"}
                </AtTag>
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
            <InfoRow label="联系人" value={info.contractName} />
            <InfoRow
              label="联系电话"
              value={info.contractPhone}
              isLink
              color="text-blue-600"
              onClick={() =>
                Taro.makePhoneCall({ phoneNumber: info.contractPhone })
              }
            />
            <InfoRow label="职位" value={info.jobTitle || "经理"} />
            <InfoRow
              label="籍贯"
              value={info.originAddr || "暂无"}
              border={false}
            />
          </DetailSection>

          {/* Section: 项目基本信息 */}
          <DetailSection title="项目基本信息" iconColor="bg-blue-400">
            <InfoRow
              label="主营项目"
              value={info.projectInfo?.projectName || "暂无"}
            />
            <InfoRow
              label="区域地址"
              value={info.projectInfo?.region?.join(" / ") || info.addr}
            />
            <InfoRow
              label="详细地址"
              value={info.projectInfo?.detailAddr || info.addr}
            />
            <InfoRow
              label="合作类型"
              value={info.projectInfo?.cooperationType}
            />
            <InfoRow label="客户类型" value={info.projectInfo?.customerType} />
            <InfoRow
              label="客户来源"
              value={info.projectInfo?.customerSource}
              border={false}
            />
          </DetailSection>

          {/* Section: 备注 */}
          <DetailSection title="备注" iconColor="bg-green-400">
            <View className="p-3 bg-gray-50/50 rounded-lg">
              <Text className="text-sm text-gray-600 leading-relaxed">
                {info.remark || "暂无备注信息..."}
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

export default CustomerDetailPage;
