import { View, Text, Input } from "@tarojs/components";
import "./index.scss";
import { MockData } from "@/typing";
import { CUSTOMER_INFO_LIST } from "../../constant/mock";
import { useNavbar } from "../../context/NavbarContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useReachBottom } from "@tarojs/taro";
import { AtToast } from "taro-ui";
const PAGE_SIZE = 10; // 每页显示条数

export default function HomePage() {
  const { navBarHeight } = useNavbar();
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("加载数据中");
  const [customerData, setCustomerData] = useState<MockData.CustomerDataType[]>(
    [],
  );

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async (pageNumber: number = 1) => {
    setDataLoading(true);
    setCustomerData(CUSTOMER_INFO_LIST);
    await delay(2000);
    setDataLoading(false);
    return CUSTOMER_INFO_LIST;
  };
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  useMemo(async () => {
    const data = await refresh(currentPage);
    setCustomerData([...customerData, ...data]);
  }, [currentPage]);

  // 3. 监听搜索词变化：重置页码到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  // 4. 触底加载更多
  useReachBottom(() => {
    console.log("触碰底部")
    setCurrentPage((prev) => prev + 1);
  });

  return (
    <View className="mesh-gradient min-h-screen pb-16" >
      <AtToast
        isOpened={dataLoading}
        text={loadingText}
        status="loading"
      ></AtToast>
      {/* 搜索栏 - 吸顶处理 */}
      <View
        className="fixed top-0 left-0 right-0 z-50 px-4 pb-2 w-full box-border"
        style={{ paddingTop: `${navBarHeight + 8}px` }}
      >
        <SearchComponent value={keyword} onInput={setKeyword} />
      </View>

      <View
        className="p-3 flex flex-col gap-2"
        style={{ paddingTop: `${navBarHeight + 64}px` }}
      >
        {customerData.map((it, idx) => (
          <CustomerCard key={idx} data={it} />
        ))}

        {/* 分页状态提示
        <View className="py-6 text-center">
          {customerData.length === 0 ? (
            <Text className="text-gray-400 text-sm">暂无匹配客户</Text>
          ) : hasMore ? (
            <Text className="text-gray-400 text-xs italic">
              正在加载更多...
            </Text>
          ) : (
            <Text className="text-gray-300 text-xs">—— 已显示全部客户 ——</Text>
          )}
        </View> */}
      </View>
    </View>
  );
}

/**
 * 搜索组件：紧凑毛玻璃设计
 */
const SearchComponent: React.FC<{
  value: string;
  onInput: (val: string) => void;
}> = ({ value, onInput }) => {
  return (
    <View className="flex items-center bg-white/40 backdrop-blur-xl border border-white/40 rounded-full px-4 py-1.5 shadow-sm">
      <View className="mr-2 opacity-50">
        <Text className="text-gray-600 text-sm">🔍</Text>
      </View>
      <Input
        className="flex-1 text-sm text-gray-800"
        placeholder="搜索企业、联系人或电话..."
        placeholderStyle="color: rgba(0,0,0,0.3)"
        value={value}
        onInput={(e) => onInput(e.detail.value)}
      />
      {value && (
        <View className="ml-2" onClick={() => onInput("")}>
          <Text className="text-gray-400 text-lg">×</Text>
        </View>
      )}
    </View>
  );
};
const CustomerCard: React.FC<{ data: MockData.CustomerDataType }> = ({
  data,
}) => {
  return (
    <View className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/60 p-3 shadow-xl backdrop-blur-md">
      {/* 顶部：标题与标签 */}
      <View className="flex justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-xs text-gray-500 block">企业名称</Text>
          <Text className="font-bold text-gray-800 leading-tight">
            {data.companyName}
          </Text>
        </View>
        {/* 标签化处理 */}
        <View className="ml-4 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Text className="text-xs font-medium text-blue-600">{data.tag}</Text>
        </View>
      </View>

      <View className="h-[1px] w-full bg-gray-200/50 mb-2" />

      {/* 底部：详细信息网格排版 */}
      <View className="grid grid-cols-1 gap-2">
        <InfoItem label="联系人" value={data.contractName} />
        <InfoItem label="联系电话" value={data.contractPhone} />
        <InfoItem label="地址" value={data.addr} />
      </View>
    </View>
  );
};

// 抽取小组件，提高代码复用性和整洁度
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex text-sm">
    <Text className="text-gray-400 w-16 flex-shrink-0">{label}</Text>
    <Text className="text-gray-600 font-medium">{value}</Text>
  </View>
);
