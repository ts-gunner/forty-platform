import { View, Text, Input, Button, ScrollView } from "@tarojs/components";
import "./index.scss";
import { MockData } from "@/typing";
import {
  COOPERATION_TYPE_LIST,
  CUSTOMER_CATEGORY_LIST,
  CUSTOMER_INFO_LIST,
  CUSTOMER_SOURCE_LIST,
  CUSTOMER_TYPE_LIST,
} from "../../constant/mock";
import { useNavbar } from "../../context/NavbarContext";
import { useEffect, useState } from "react";
import Taro, { useDidShow, useReachBottom } from "@tarojs/taro";
import { AtDrawer, AtIcon, AtToast } from "taro-ui";
import { withGlobalLayout } from "../../components/AppLayout";

enum FilterMenuType {
  FILTER = "filter",
  CUSTOMER_TYPE = "customer_type",
}
function AllCustomerPage() {
  const { navBarHeight } = useNavbar();
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
    setDataLoading(false);
    return CUSTOMER_INFO_LIST;
  };

  // 4. 触底加载更多
  useReachBottom(() => {
    console.log("触碰底部");
    setCurrentPage((prev) => prev + 1);
  });

  return (
    <View className="mesh-gradient min-h-screen pb-16">
      <AtToast
        isOpened={dataLoading}
        text={loadingText}
        status="loading"
      ></AtToast>

      <FilterHeader />

      <View className="p-3 flex flex-col gap-2">
        {customerData.map((it, idx) => (
          <CustomerCard key={idx} data={it} />
        ))}
      </View>
    </View>
  );
}
const FilterHeader: React.FC<{}> = () => {
  const { navBarHeight } = useNavbar();
  const [keyword, setKeyword] = useState("");
  const [activeMenu, setActiveMenu] = useState<FilterMenuType | null>(null); // 控制哪个菜单展开
  // 小菜单的筛选结果
  const [filterParams, setFilterParams] = useState<
    Record<string, string | null>
  >({
    [FilterMenuType.CUSTOMER_TYPE]: null,
  });
  // 切换菜单展开/收起
  const toggleMenu = (menuName: FilterMenuType) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // 选择筛选项
  const handleSelect = (type: FilterMenuType, value: string) => {
    setFilterParams((prev) => ({ ...prev, [type]: value }));
    setActiveMenu(null);
    // 这里触发刷新数据逻辑...
    console.log("执行筛选:", value);
  };
  return (
    <View
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md"
      style={{ paddingTop: `${navBarHeight}px` }}
    >
      {/* 搜索框 */}
      <View className="p-3">
        <SearchComponent value={keyword} onInput={setKeyword} />
      </View>

      {/* 2. 下拉菜单触发器 (Tab Bar) */}
      <View className="flex border-b border-gray-100 bg-white">
        <FilterTab
          label={filterParams[FilterMenuType.CUSTOMER_TYPE] || "客户类型"}
          active={activeMenu === FilterMenuType.CUSTOMER_TYPE}
          onClick={() => toggleMenu(FilterMenuType.CUSTOMER_TYPE)}
        />
        <FilterTab
          icon={
            <AtIcon
              value="filter"
              size="15"
              className={`${activeMenu === FilterMenuType.FILTER ? "text-active" : "text-gray-500"}`}
            />
          }
          label="筛选"
          active={activeMenu === FilterMenuType.FILTER}
          onClick={() => toggleMenu(FilterMenuType.FILTER)}
        />
      </View>

      {/* 3. 下拉浮层内容 */}
      {activeMenu && (
        <View className="absolute top-full left-0 w-full z-50">
          {/* 遮罩层 */}
          <View
            className="fixed inset-0 bg-black/20"
            onClick={() => setActiveMenu(null)}
          />
          {/* 选项列表 */}
          <View className="relative bg-white animate-fade-in-down shadow-xl rounded-b-xl overflow-hidden">
            {activeMenu === FilterMenuType.CUSTOMER_TYPE && (
              <CustomerFilterMenu
                handleSelect={handleSelect}
                activeMenu={activeMenu}
                filterParams={filterParams}
              />
            )}
            {activeMenu === FilterMenuType.FILTER && <AllFilterMenu />}
          </View>
        </View>
      )}
    </View>
  );
};

const CustomerFilterMenu = ({
  activeMenu,
  handleSelect,
  filterParams,
}: {
  activeMenu: FilterMenuType;
  handleSelect: (activeKey: FilterMenuType, val: string | null) => void;
  filterParams: Record<string, string | null>;
}) => {
  return (
    <View>
      <View className="p-2 flex flex-col">
        {CUSTOMER_TYPE_LIST.map((opt) => (
          <View
            key={opt}
            onClick={() => handleSelect(activeMenu, opt)}
            className={`flex justify-between items-center p-4 rounded-xl'
            }`}
          >
            <Text className="text-sm font-medium">{opt}</Text>
            {opt === filterParams[activeMenu] && (
              <AtIcon value="check" size="16" className="text-active" />
            )}
          </View>
        ))}
      </View>
      <Button
        className="w-full text-red-600 text-md"
        onClick={() => handleSelect(activeMenu, null)}
      >
        清空
      </Button>
    </View>
  );
};
const filterSiderMenu = [
  {
    label: "客户类型",
    key: "customer_type",
    options: CUSTOMER_TYPE_LIST,
  },
  {
    label: "客户分类",
    key: "customer_category",
    options: CUSTOMER_CATEGORY_LIST,
  },
  {
    label: "合作类型",
    key: "cooperate_type",
    options: COOPERATION_TYPE_LIST,
  },
  {
    label: "客户来源",
    key: "customer_source",
    options: CUSTOMER_SOURCE_LIST,
  },
  {
    label: "客户类型2",
    key: "customer_type2",
    options: CUSTOMER_TYPE_LIST,
  },
];
const AllFilterMenu = () => {
  const [selectedSider, setSelectedSider] = useState(filterSiderMenu[0].key);
  return (
    <View className="">
      <View className="h-[45vh] flex">
        <View className="flex-[3] w-[30px] bg-gray-200 h-full flex flex-col gap-2">
          {filterSiderMenu.map((it) => (
            <View
              className={`flex ${it.key === selectedSider && "bg-white"}`}
              key={it.key}
              onClick={() => setSelectedSider(it.key)}
            >
              {it.key === selectedSider && (
                <View className="h-full bg-active w-1"></View>
              )}

              <Text
                className={`text-sm  py-3 flex justify-center flex-1 ${it.key === selectedSider && "font-bold"}`}
              >
                {it.label}
              </Text>
            </View>
          ))}
        </View>
        <ScrollView
          scrollY
          scrollWithAnimation
          scrollIntoView={`filter-option-${selectedSider}`}
          enhanced
          className="flex-[9] h-full p-2"
        >
          {filterSiderMenu.map((it) => (
            <View className="mt-2" key={it.key} id={`filter-option-${it.key}`}>
              <Text className="text-sm font-bold">{it.label}</Text>
              <View className="grid grid-cols-3 gap-2 mt-2">
                {it.options.map((opt) => (
                  <View className="text-sm bg-gray-100 flex justify-center items-center py-2 rounded-lg">
                    {opt}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View className="flex py-2 items-center gap-3 px-4">
        <View className="flex-[3] text-sm font-bold flex justify-center items-center">
          重置
        </View>
        <Button className="flex-[9] text-sm py-2 font-bold bg-active/50 rounded-full">
          查看全部
        </Button>
      </View>
    </View>
  );
};
/**
 * 筛选标签组件
 */
const FilterTab = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <View
    onClick={onClick}
    className="flex-1 flex items-center justify-center py-3 transition-colors active:bg-gray-50"
  >
    <View className="flex items-center gap-2">
      {icon}
      <Text
        className={`text-xs mr-1 ${active ? "text-active font-bold" : "text-gray-500"}`}
      >
        {label}
      </Text>
    </View>

    <View
      className={`transition-transform duration-300 ${active ? "rotate-180" : ""}`}
    >
      <AtIcon
        value="chevron-down"
        size="14"
        className={`${active ? "text-active" : "text-gray-500"}`}
      />
    </View>
  </View>
);
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
        <View className="px-3 py-1  shadow rounded-full flex justify-center items-center bg-active">
          <Text className="text-xs font-medium text-white">{data.tag}</Text>
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

export default withGlobalLayout(AllCustomerPage);
