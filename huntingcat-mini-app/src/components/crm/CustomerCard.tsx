import { Dispatch } from "@/store";
import { MockData } from "@/typing";
import { Text, View } from "@tarojs/components";
import { useDispatch } from "react-redux";

export const MyCustomerCard: React.FC<{
  data: API.CrmEntityValueVo;
  onClick: (key: string) => void;
}> = ({ data, onClick }) => {
  const dispatch = useDispatch<Dispatch>();
  const dataObject = JSON.parse(data.values);
  return (
    <View
      onClick={() => onClick(data.id)}
      className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-md mb-1"
    >
      {/* 顶部：公司名与状态标签 */}
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-[20rpx] text-gray-400 block mb-0.5">
            {dispatch.crmModel.getFieldName("customer_name")}
          </Text>
          <Text className="text-[32rpx] font-bold text-gray-800 leading-tight">
            {dataObject["customer_name"]}
          </Text>
        </View>
        {/* 标签 */}
        <View className="px-3 py-2 rounded-full bg-active shadow-sm flex items-center justify-center">
          <Text className="text-[22rpx] font-medium text-white">
            {dataObject["customer_type"]}
          </Text>
        </View>
      </View>

      {/* 客户基本信息 */}
      <View className="space-y-2 mb-3">
        <InfoItem
          label={dispatch.crmModel.getFieldName("contract_name")}
          value={dataObject["contract_name"]}
        />
        <InfoItem
          label={dispatch.crmModel.getFieldName("contract_phone")}
          value={dataObject["contract_phone"]}
        />
        <InfoItem
          label={dispatch.crmModel.getFieldName("detail_addr")}
          value={dataObject["detail_addr"]}
        />
      </View>
    </View>
  );
};
export const AllCustomerCard: React.FC<{
  data: API.CrmEntityValueVo;
  onClick: (key: string) => void;
}> = ({ data, onClick }) => {
  const dispatch = useDispatch<Dispatch>();
  const dataObject = JSON.parse(data.values);
  return (
    <View
      onClick={() => onClick(data.id)}
      className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-md mb-1"
    >
      {/* 顶部：公司名与状态标签 */}
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-[20rpx] text-gray-400 block mb-0.5">
            {dispatch.crmModel.getFieldName("customer_name")}
          </Text>
          <Text className="text-[32rpx] font-bold text-gray-800 leading-tight">
            {dataObject["customer_name"]}
          </Text>
        </View>
        {/* 标签 */}
        <View className="px-3 py-2 rounded-full bg-active shadow-sm text-center">
          <Text className="text-[22rpx] font-medium text-white flex items-center justify-center">
            {dataObject["customer_type"]}
          </Text>
        </View>
      </View>

      {/* 客户基本信息 */}
      <View className="space-y-2 mb-3">
        <InfoItem
          label={dispatch.crmModel.getFieldName("contract_name")}
          value={dataObject["contract_name"]}
        />
        <InfoItem
          label={dispatch.crmModel.getFieldName("contract_phone")}
          value={dataObject["contract_phone"]}
        />
        <InfoItem
          label={dispatch.crmModel.getFieldName("detail_addr")}
          value={dataObject["detail_addr"]}
        />
      </View>

      {/* 分隔虚线或细线 */}
      <View className="h-[1px] w-full border-t border-dashed border-gray-200 mb-3" />

      {/* 底部：归属业务员信息 */}
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          {/* 业务员头像占位/图标 */}
          <View className="w-6 h-6 rounded-full bg-active flex items-center justify-center mr-2">
            <Text className="text-[18rpx] text-white font-bold">责</Text>
          </View>
          <View>
            <Text className="text-[20rpx] text-gray-400">业务员:</Text>
            <Text className="text-[24rpx] font-semibold text-gray-700">
              {data.userName}
            </Text>
          </View>
        </View>
        {/* 
        <View className="bg-gray-100 px-2 py-0.5 rounded">
          <Text className="text-[20rpx] text-gray-500">{"广州分部"}</Text>
        </View> */}
      </View>
    </View>
  );
};
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex text-sm">
    <Text className="text-gray-400 w-16 flex-shrink-0">{label}</Text>
    <Text className="text-gray-600 font-medium">{value}</Text>
  </View>
);
