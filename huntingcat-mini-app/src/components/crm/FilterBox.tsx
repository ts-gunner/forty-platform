import { Button, ScrollView, Text, View } from "@tarojs/components";
import { useState } from "react";
import { AtIcon } from "taro-ui";
import { COOPERATION_TYPE_LIST, CUSTOMER_CATEGORY_LIST, CUSTOMER_INFO_LIST, CUSTOMER_SOURCE_LIST, CUSTOMER_TYPE_LIST } from "../../constant/mock";


enum FilterMenuType {
  FILTER = "filter",
  CUSTOMER_TYPE = "customer_type",
  BUSINESS_WORKER = "business_worker"
}

export const FilterComponent = ({ mode }: { mode: "mine" | "all" }) => {
  const [activeMenu, setActiveMenu] = useState<FilterMenuType | null>(null); // 控制哪个菜单展开
  // 小菜单的筛选结果
  const [filterParams, setFilterParams] = useState<Record<string, string | null>>({
    [FilterMenuType.CUSTOMER_TYPE]: null,
    [FilterMenuType.BUSINESS_WORKER]: null,
  });
  // 切换菜单展开/收起
  const toggleMenu = (menuName: FilterMenuType) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // 选择筛选项
  const handleSelect = (type: FilterMenuType, value: string) => {
    setFilterParams(prev => ({ ...prev, [type]: value }));
    setActiveMenu(null);
    // 这里触发刷新数据逻辑...
    console.log("执行筛选:", value);
  };
  return (
    <View className="sticky top-0 z-50">
      {/* 2. 下拉菜单触发器 (Tab Bar) */}
      <View className="flex">
        {
          mode === "all" && (
            <FilterTab
              label={filterParams[FilterMenuType.BUSINESS_WORKER] || "业务员"}
              active={activeMenu === FilterMenuType.BUSINESS_WORKER}
              onClick={() => toggleMenu(FilterMenuType.BUSINESS_WORKER)}
            />
          )
        }
        <FilterTab
          label={filterParams[FilterMenuType.CUSTOMER_TYPE] || "客户类型"}
          active={activeMenu === FilterMenuType.CUSTOMER_TYPE}
          onClick={() => toggleMenu(FilterMenuType.CUSTOMER_TYPE)}
        />
        <FilterTab
          icon={<AtIcon value='filter' size='15' className={`text-white`} />}
          label='筛选'
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
            {
              activeMenu === FilterMenuType.BUSINESS_WORKER && <BusinessWorkerFilterMenu
                handleSelect={handleSelect}
                activeMenu={activeMenu}
                filterParams={filterParams}
              />
            }
            {
              activeMenu === FilterMenuType.CUSTOMER_TYPE && <CustomerFilterMenu
                handleSelect={handleSelect}
                activeMenu={activeMenu}
                filterParams={filterParams} />
            }
            {
              activeMenu === FilterMenuType.FILTER && <AllFilterMenu />
            }
          </View>

        </View >
      )}
    </View>
  )
}

/**
 * 筛选标签组件
 */
const FilterTab = ({ icon, label, active, onClick }: { icon?: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <View
    onClick={onClick}
    className="flex-1 flex items-center justify-center py-3 transition-colors"
  >
    <View className="flex items-center gap-2">
      {icon}
      <Text className={`text-white text-xs mr-1 ${active ? 'font-bold' : ''}`}
      >{label}</Text>
    </View>

    <View className={`transition-transform duration-300 ${active ? 'rotate-180' : ''}`}>
      <AtIcon value='chevron-down' size='14' className={`text-white`} />
    </View>
  </View>
);

const WORKERS = ["张三", "李四", "王五", "赵六", "陈七", "王八", "杨九", "张三", "李四", "王五", "赵六", "陈七", "王八", "杨九", "张三", "李四", "王五", "赵六", "陈七", "王八", "杨九", "张三", "李四", "王五", "赵六", "陈七", "王八", "杨九"]
export const BusinessWorkerFilterMenu = ({
  activeMenu, handleSelect, filterParams
}: {
  activeMenu: string,
  handleSelect: (activeKey: string, val: string | null) => void;
  filterParams: Record<string, string | null>
}) => {
  return (
    <View className="flex flex-col bg-white rounded-b-2xl overflow-hidden">
      {/* 滚动区域：限制高度，防止撑破页面 */}
      <ScrollView
        scrollY
        className="max-h-[40vh]" // 设置最大高度为屏幕的 
      >
        <View className="p-2 flex flex-col">
          {WORKERS.map((worker, index) => {
            const isSelected = worker === filterParams[activeMenu];
            return (
              <View
                key={`${worker}-${index}`} // 名字重复，使用 index 保证 key 唯一
                onClick={() => handleSelect(activeMenu, worker)}
                className={`flex justify-between items-center p-4 rounded-xl transition-colors ${isSelected ? 'bg-blue-50/50' : 'active:bg-gray-50'
                  }`}
              >
                <Text className={`text-sm ${isSelected ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                  {worker}
                </Text>

                {isSelected && (
                  <AtIcon value='check' size='16' color='#3b82f6' />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 底部固定操作栏 */}
      <View className="p-4 border-t border-gray-100 flex flex-row gap-3">
        <Button
          className="flex-1 bg-gray-100 text-gray-600 text-sm rounded-full border-none after:border-none"
          onClick={() => handleSelect(activeMenu, null)}
        >
          重置
        </Button>
        {/* 如果需要确定按钮可以加上，如果想点击即选中则保留重置即可 */}
      </View>
    </View>
  );
};
/**
客户类型筛选下拉框
 */
const CustomerFilterMenu = ({
  activeMenu, handleSelect, filterParams
}: {
  activeMenu: FilterMenuType, handleSelect: (activeKey: FilterMenuType, val: string | null) => void;
  filterParams: Record<string, string | null>
}) => {

  return (

    <View>
      <View className="p-2 flex flex-col">
        {CUSTOMER_TYPE_LIST.map(opt => (
          <View
            key={opt}
            onClick={() => handleSelect(activeMenu, opt)}
            className={`flex justify-between items-center p-4 rounded-xl'
            }`}
          >
            <Text className="text-sm font-medium">{opt}</Text>
            {
              opt === filterParams[activeMenu] && <AtIcon value='check' size='16' className="text-active" />
            }

          </View>
        ))}


      </View>
      <Button className="w-full text-red-600 text-md" onClick={() => handleSelect(activeMenu, null)}>
        清空
      </Button>
    </View>

  )
}
const filterSiderMenu = [
  {
    label: "客户类型",
    key: "customer_type",
    options: CUSTOMER_TYPE_LIST
  },
  {
    label: "客户分类",
    key: "customer_category",
    options: CUSTOMER_CATEGORY_LIST
  },
  {
    label: "合作类型",
    key: "cooperate_type",
    options: COOPERATION_TYPE_LIST
  },
  {
    label: "客户来源",
    key: "customer_source",
    options: CUSTOMER_SOURCE_LIST
  },
  {
    label: "客户类型2",
    key: "customer_type2",
    options: CUSTOMER_TYPE_LIST
  },
]

/**
所有筛选下拉框
 */
const AllFilterMenu = () => {
  const [selectedSider, setSelectedSider] = useState(filterSiderMenu[0].key)
  return (
    <View className="">
      <View className="h-[45vh] flex">
        <View
          className="flex-[3] w-[30px] bg-gray-200 h-full flex flex-col gap-2">
          {
            filterSiderMenu.map(it => (
              <View className={`flex ${it.key === selectedSider && "bg-white"}`} key={it.key} onClick={() => setSelectedSider(it.key)}>
                {it.key === selectedSider && <View className="h-full bg-active w-1"></View>}

                <Text className={`text-sm  py-3 flex justify-center flex-1 ${it.key === selectedSider && "font-bold"}`}>{it.label}</Text>
              </View>
            ))
          }
        </View>
        <ScrollView
          scrollY
          scrollWithAnimation
          scrollIntoView={`filter-option-${selectedSider}`}
          enhanced
          className="flex-[9] h-full p-2">
          {
            filterSiderMenu.map(it => (
              <View className="mt-2" key={it.key}
                id={`filter-option-${it.key}`}
              >

                <Text className="text-sm font-bold">{it.label}</Text>
                <View className="grid grid-cols-3 gap-2 mt-2">
                  {
                    it.options.map(opt => (
                      <View className="text-sm bg-gray-100 flex justify-center items-center py-2 rounded-lg">{opt}</View>
                    ))
                  }
                </View>

              </View>
            ))
          }

        </ScrollView>
      </View>
      <View className="flex py-2 items-center gap-3 px-4">
        <View className="flex-[3] text-sm font-bold flex justify-center items-center">重置</View>
        <Button className="flex-[9] text-sm text-white py-2 font-bold bg-active rounded-full">查看全部</Button>
      </View>
    </View>
  )
}
