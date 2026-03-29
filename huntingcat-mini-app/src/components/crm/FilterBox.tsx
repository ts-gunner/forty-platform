import { Button, ScrollView, Text, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { AtIcon } from "taro-ui";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { findFieldByFieldKey } from "@/utils/crm";
import { CrmDataTypeEnum } from "@/constant/enums";
import { cn, handleResponse, Notify } from "@/utils/common";
import { getUserListByRoleKey } from "@/services/steins-admin/systemUserController";
import { CRM_ROLE_NAME } from "@/constant/global";

const ALL_COMMON_FILTER = ["business_worker", "customer_type"];
const MY_COMMON_FILTER = ["customer_type"];



// 目前只对Picker类型的筛选
export const FilterComponent = ({ mode }: { mode: "mine" | "all" }) => {
  // 额外字段解释
  const EXTRA_FIELD_MAP = {
    business_worker: {
      fieldName: "业务员",
      getOptions: () => {
        return buinessUserList
      },
    },
  };
  const dispatch = useDispatch<Dispatch>()
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const activeRoute = useSelector(
    (state: RootState) => state.routerModel.activeRoute,
  );
  const filterParams = useSelector(
    (state: RootState) => state.crmModel.filterParams,
  );
  const [buinessUserList, setBusinessUserList] = useState<{ label: string; value: string }[]>([])
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // 控制哪个菜单展开

  const commonFilters = mode === "mine" ? MY_COMMON_FILTER : ALL_COMMON_FILTER;
  // 切换菜单展开/收起
  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // 选择筛选项
  const handleSelect = (type: string, value: string) => {
    dispatch.crmModel.setFilterParams({
      ...filterParams,
      [type]: value
    });
    dispatch.crmModel.getEntityValues({
      mode
    })
    setActiveMenu(null);
  };
  useEffect(() => {
    if (mode === "all") {
      getBusinessWorkerOptions()
    }
  }, [activeRoute, mode])
  const getBusinessWorkerOptions = async () => {
    const resp = await getUserListByRoleKey({
      roleKey: CRM_ROLE_NAME,
      pageSize: 9999
    })
    handleResponse({
      resp,
      onSuccess: (data) => {
        let userList = data.list.map(it => ({
          label: it.nickName,
          value: it.userId
        }))
        setBusinessUserList(userList)
      },
      onError: () => {
        Notify.fail("获取业务员信息失败：" + resp.msg)
      }
    })
  }

  const getFieldNameByKey = (key: string) => {
    let field = findFieldByFieldKey(tableFields, key);
    if (!field) {
      return EXTRA_FIELD_MAP?.[key]?.fieldName || "未知";
    }
    return field.fieldName;
  };

  const getFieldOptionsByKey = (
    key: string,
  ): { label: string; value: string }[] => {
    let field = findFieldByFieldKey(tableFields, key);
    if (!field) {
      return EXTRA_FIELD_MAP?.[key]?.getOptions() || [];
    }
    return (
      field.options.split(",").map((it) => ({ label: it, value: it })) || []
    );
  };

  const getFieldValueByKey = (key: string) => {
    let options = getFieldOptionsByKey(key);
    let val = options.find((it) => it.value === filterParams[key]);
    if (val) {
      return val.label;
    }
    return "";
  };

  const resetPickerSelect = () => {
    // 清空picker相关字段的值
    let fields = tableFields.filter(
      (it) => it.dataType === CrmDataTypeEnum.Picker,
    );
    dispatch.crmModel.setFilterParams({});
    dispatch.crmModel.getEntityValues({ mode })
    setActiveMenu(null)
  };
  const handlePickerSelect = (fieldKey: string, val: string) => {
    let paramValue = filterParams?.[fieldKey]
    if (paramValue) {
      let options = paramValue.split(",")

      if (options.includes(val)) {
        options = options.filter(it => it !== val)
      } else {
        options = [...options, val]
      }

      dispatch.crmModel.setFilterParams({
        ...filterParams,
        [fieldKey]: options.join(",")
      })
    } else {
      dispatch.crmModel.setFilterParams({
        ...filterParams,
        [fieldKey]: val
      })
    }

  };
  // 全局搜索
  const searchFilter = async () => {
    await dispatch.crmModel.getEntityValues({ mode })
    setActiveMenu(null);
  }
  return (
    <View className="sticky top-0 z-50">
      {/* 2. 下拉菜单触发器 (Tab Bar) */}
      <View className="flex">
        {commonFilters.map((k) => (
          <FilterTab
            label={getFieldValueByKey(k) || getFieldNameByKey(k)}
            active={activeMenu === k}
            onClick={() => toggleMenu(k)}
          />
        ))}

        <FilterTab
          icon={<AtIcon value="filter" size="15" className={`text-white`} />}
          label="筛选"
          active={activeMenu === "filter"}
          onClick={() => toggleMenu("filter")}
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
            {commonFilters.map((key) => {
              return (
                activeMenu === key && (
                  <CommonFilterMenu
                    fieldKey={key}
                    options={getFieldOptionsByKey(key)}
                    handleSelect={handleSelect}
                    filterParams={filterParams}
                  />
                )
              );
            })}
            {activeMenu === "filter" && (
              <AllFilterMenu
                searchFilter={searchFilter}
                filterParams={filterParams}
                handlePickerSelect={handlePickerSelect}
                resetPickerSelect={resetPickerSelect}
              />
            )}
          </View>
        </View>
      )}
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
    className="flex-1 flex items-center justify-center py-3 transition-colors"
  >
    <View className="flex items-center gap-2">
      {icon}
      <Text className={`text-white text-xs mr-1 ${active ? "font-bold" : ""}`}>
        {label}
      </Text>
    </View>

    <View
      className={`transition-transform duration-300 ${active ? "rotate-180" : ""}`}
    >
      <AtIcon value="chevron-down" size="14" className={`text-white`} />
    </View>
  </View>
);

/**
所有筛选下拉框
 */
const AllFilterMenu: React.FC<{
  filterParams: Record<string, any>;
  handlePickerSelect: (fieldKey: string, val: string) => void;
  resetPickerSelect: () => void;
  searchFilter: () => void
}> = ({ filterParams, resetPickerSelect, handlePickerSelect, searchFilter }) => {
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );

  // 只筛选Picker类型数据
  const filterTableFields = tableFields.filter(
    (it) => it.dataType === CrmDataTypeEnum.Picker,
  );
  const [selectedSider, setSelectedSider] = useState(
    filterTableFields[0].fieldKey,
  );

  return (
    <View className="h-[50vh] flex flex-col">
      <View className="flex flex-1 overflow-hidden">
        <View className="flex-[3] w-[30px] bg-gray-200/70 h-full flex flex-col gap-2">
          {filterTableFields.map((it) => {
            return (
              <View
                className={`flex ${it.fieldKey === selectedSider && "bg-white"}`}
                key={it.fieldKey}
                onClick={() => setSelectedSider(it.fieldKey)}
              >
                {it.fieldKey === selectedSider && (
                  <View className="h-full bg-active w-1"></View>
                )}

                <Text
                  className={`text-sm  py-3 flex justify-center flex-1 ${it.fieldKey === selectedSider && "font-bold"}`}
                >
                  {it.fieldName}
                </Text>
              </View>
            );
          })}
        </View>
        <ScrollView
          scrollY
          scrollWithAnimation
          scrollIntoView={`filter-option-${selectedSider}`}
          enhanced
          className="flex-[9] h-full p-4"
        >
          {filterTableFields.map((it) => (
            <View
              className="mt-2"
              key={it.fieldKey}
              id={`filter-option-${it.fieldKey}`}
            >
              <Text className="text-sm font-bold">{it.fieldName}</Text>
              <View className="grid grid-cols-3 gap-2 mt-2">
                {it.options.split(",").map((opt) => {
                  let val = filterParams?.[it.fieldKey]
                  let selectedValues = val?.split(",") || []
                  return (
                    <View
                      className={cn(
                        "text-sm  flex justify-center items-center py-2 rounded-lg",
                        selectedValues.includes(opt) ? "bg-active text-white" : "bg-gray-100"
                      )}
                      key={opt}
                      onClick={() => handlePickerSelect(it.fieldKey, opt)}
                    >
                      {opt}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
          <View className="h-10" />
        </ScrollView>
      </View>
      <View className="flex flex-shrink-0 py-2 items-center gap-3 px-4">
        <View
          className="flex-[3] text-sm font-bold flex justify-center items-center"
          onClick={resetPickerSelect}
        >
          重置
        </View>
        <Button className="flex-[9] text-sm text-white py-2 font-bold bg-active rounded-full" onClick={searchFilter}>
          查看全部
        </Button>
      </View>
    </View>
  );
};

const CommonFilterMenu = ({
  fieldKey,
  handleSelect,
  filterParams,
  options,
}: {
  fieldKey: string;
  handleSelect: (activeKey: string, val: string | null) => void;
  filterParams: Record<string, string | null>;
  options: { label: string; value: string }[];
}) => {
  return (
    <View>
      <View className="p-2 flex flex-col">
        {options.map((opt) => (
          <View
            key={opt.value}
            onClick={() => handleSelect(fieldKey, opt.value)}
            className={`flex justify-between items-center p-4 rounded-xl'
            }`}
          >
            <Text className="text-sm font-medium">{opt.label}</Text>
            {opt.value === filterParams[fieldKey] && (
              <AtIcon value="check" size="16" className="text-active" />
            )}
          </View>
        ))}
      </View>
      <Button
        className="w-full text-red-600 text-md"
        onClick={() => handleSelect(fieldKey, null)}
      >
        清空
      </Button>
    </View>
  );
};
