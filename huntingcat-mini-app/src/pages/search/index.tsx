import { withGlobalLayout } from "@/components/AppLayout";
import { CustomerCard, CustomerSearchCard } from "@/components/crm/CustomerCard";
import EmptyComponent from "@/components/EmptyComponent";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { ROUTERS } from "@/constant/menus";
import { getEntityValueList } from "@/services/steins-admin/crmEntityValueController";
import { Dispatch, RootState } from "@/store";
import { handleResponse, Notify } from "@/utils/common";
import storage from "@/utils/storage";
import { Input, Picker, Text, View, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AtIcon } from "taro-ui";

const HISTORY_KEY = "searchMemory";
const CURRENT_PAGE = ROUTERS.searchCustomer;
const PAGE_SIZE = 20; // 抽取每页数量常量

function SearchCustomerPage() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isShowRemove, setIsShowRemove] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<API.CrmEntityValueVo[]>([]);
  const [searhTotal, setSearchTotal] = useState<number>(0);
  const [isEmpty, setEmpty] = useState<boolean>(false);

  // ---- 新增分页相关状态 ----
  const [pageNum, setPageNum] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);

  const dispatch = useDispatch<Dispatch>();
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo);
  const activeRoute = useSelector(
    (state: RootState) => state.routerModel.activeRoute,
  );
  const [activeField, setActiveField] = useState<API.CrmEntityFieldVo>(
    tableFields.length > 0 ? tableFields[0] : null,
  );

  useEffect(() => {
    if (!activeRoute) {
      return;
    }
    if (CURRENT_PAGE === activeRoute) {
      refreshHistory();
    }
  }, [activeRoute]);

  const refreshHistory = () => {
    storage.getItem(HISTORY_KEY).then((res) => {
      if (!res) {
        return;
      }
      try {
        let history = JSON.parse(res);
        setSearchHistory(history);
      } catch {}
    });
  };

  /**
   * 核心数据请求方法（支持追加分页）
   * @param keyword 搜索词
   * @param targetPage 目标请求页码
   * @param isRefresh 是否为全新搜索/刷新
   */
  const searchCustomerData = async (keyword: string, targetPage: number, isRefresh: boolean = false) => {
    if (isRefresh) {
      setEmpty(false);
      setSearchLoading(true);
      setSearchResult([]); // 刷新时先清空历史结果
    } else {
      setLoadMoreLoading(true);
    }

    const resp = await getEntityValueList({
      entityKey: entityVo.entityCode,
      pageNum: targetPage,
      pageSize: PAGE_SIZE,
      filterParams: {
        [activeField.fieldKey]: keyword,
      },
    });

    handleResponse({
      resp,
      onSuccess: (data) => {
        const list = data.entityValue?.list || [];
        const total = data.entityValue?.total || 0;

        setSearchTotal(total);
        
        // 判断是否是第一页刷新，如果是则覆盖，否则追加
        const newList = isRefresh ? list : [...searchResult, ...list];
        setSearchResult(newList);
        setPageNum(targetPage);

        // 判断是否还有更多数据
        setHasMore(newList.length < total);

        if (total === 0) {
          setEmpty(true);
        }
      },
      onError: () => {
        Notify.fail(resp.msg || "请求失败");
      },
      onFinish: () => {
        setSearchLoading(false);
        setLoadMoreLoading(false);
      },
    });
  };

  // 触发首次全新搜索
  const handleInitialSearch = (keyword: string) => {
    if (!keyword) return;
    searchCustomerData(keyword, 1, true);
  };

  // 触发加载下一页
  const handleLoadMore = () => {
    if (searchLoading || loadMoreLoading || !hasMore) return;
    searchCustomerData(searchText, pageNum + 1, false);
  };

  return (
    <HeaderBodyFooterLayout title="搜索" className="bg-gray-100">
      {/* 
        可以使用 Taro 的原生页面触底事件（需要在配置中开启，或在此处直接包裹标准 ScrollView）
        这里为了保持原有 HBF 布局的兼容，推荐使用 ScrollView 绑定由下往上滑动的触底
      */}
      <ScrollView 
        scrollY 
        style={{ height: '100%' }} 
        onScrollToLower={handleLoadMore} // 滑动到底部自动加载下一页
        lowerThreshold={150} // 距离底部150px时提前触发加载
      >
        <View className="pb-6">
          <SearchComponent
            value={searchText}
            onInput={setSearchText}
            tableFields={tableFields}
            activeField={activeField}
            setActiveField={setActiveField}
            onSearch={async () => {
              if (!searchText) {
                return;
              }
              let memory = await storage.getItem(HISTORY_KEY);
              if (memory) {
                try {
                  let history = JSON.parse(memory) as string[];
                  if (history.includes(searchText)) {
                    history = history.filter((it) => it !== searchText);
                  }
                  history.push(searchText);
                  await storage.setItem(
                    HISTORY_KEY,
                    JSON.stringify(history.slice(0, 5)),
                  );
                } catch {
                  await storage.setItem(
                    HISTORY_KEY,
                    JSON.stringify([searchText]),
                  );
                }
              } else {
                await storage.setItem(HISTORY_KEY, JSON.stringify([searchText]));
              }
              refreshHistory();
              handleInitialSearch(searchText); // 执行全新搜索
            }}
          />
          
          {!searchText && (
            <View className="mt-3 px-3">
              <View className="flex justify-between">
                <Text className="text-sm text-gray-500">搜索历史</Text>
                {isShowRemove ? (
                  <View className="flex items-center gap-3">
                    <Text
                      className="text-sm text-red-500"
                      onClick={() => {
                        Taro.showModal({
                          title: "删除全部",
                          content: "确定删除全部搜索历史?",
                          confirmText: "删除",
                          success: (res) => {
                            if (res.confirm) {
                              storage.removeItem(HISTORY_KEY).then(() => {
                                setSearchHistory([]);
                                setIsShowRemove(false);
                              });
                            }
                          },
                        });
                      }}
                    >
                      删除全部
                    </Text>
                    <Text
                      className="text-sm text-blue-500"
                      onClick={() => {
                        setIsShowRemove(false);
                      }}
                    >
                      完成
                    </Text>
                  </View>
                ) : (
                  <AtIcon
                    value="trash"
                    className="text-gray-500"
                    onClick={() => setIsShowRemove(true)}
                  />
                )}
              </View>
              <View className="mt-4 flex items-center gap-3 flex-wrap">
                {searchHistory.map((it, idx) => (
                  <View
                    key={idx}
                    onClick={() => {
                      setSearchText(it);
                      handleInitialSearch(it); // 点击历史记录执行全新搜索
                    }}
                    className="py-2 px-4 bg-white text-gray-700 text-sm rounded-lg"
                  >
                    {it}
                  </View>
                ))}
              </View>
            </View>
          )}

          {searchLoading && (
            <View className="flex justify-center items-center gap-2 mt-4 text-gray-600">
              <AtIcon value="loading" className="animate-spin" />
              <Text>正在加载第一页...</Text>
            </View>
          )}

          {searchResult.length > 0 && (
            <View className="ml-3 mt-3 flex items-center text-sm">
              <Text>搜索到</Text>
              <Text className="text-red-500 font-bold mx-1">{searhTotal}</Text>
              <Text>条结果</Text>
            </View>
          )}

          <View className="flex flex-col w-full mt-3 gap-2 px-3">
            {searchResult.map((it, idx) => (
              <CustomerSearchCard
                key={idx}
                index={idx}
                data={it}
                onClick={() => {
                  dispatch.crmModel.setSelectedEntityValue(it);
                  dispatch.routerModel.navigateTo({
                    url: ROUTERS.customerDetail,
                  });
                }}
              />
            ))}
          </View>

          {/* ---- 新增底部加载更多/无更多数据提示状态 ---- */}
          {searchResult.length > 0 && (
            <View className="flex justify-center items-center py-4 text-xs text-gray-400" onClick={handleLoadMore}>
              {loadMoreLoading ? (
                <View className="flex items-center gap-1">
                  <AtIcon value="loading" className="animate-spin text-sm" />
                  <Text>正在加载更多...</Text>
                </View>
              ) : hasMore ? (
                <Text>上滑或点击加载更多</Text>
              ) : (
                <Text>— 已经到底啦 —</Text>
              )}
            </View>
          )}

          {isEmpty && <EmptyComponent />}
        </View>
      </ScrollView>
    </HeaderBodyFooterLayout>
  );
}

// 保持不变
const SearchComponent: React.FC<{
  value: string;
  onInput: (val: string) => void;
  onSearch: () => void;
  tableFields: API.CrmEntityFieldVo[];
  activeField: API.CrmEntityFieldVo;
  setActiveField: (field: API.CrmEntityFieldVo) => void;
}> = ({
  tableFields,
  value,
  onInput,
  onSearch,
  activeField,
  setActiveField,
}) => {
  const activeFieldIndex = tableFields.findIndex(
    (it) => it.id === activeField?.id,
  );
  return (
    <View className="flex items-center w-full bg-white px-2 py-1">
      <Picker
        mode="selector"
        range={tableFields.map((item) => item.fieldName)}
        value={activeFieldIndex}
        onChange={(e) => {
          setActiveField(tableFields[e.detail.value]);
        }}
      >
        <View className="flex items-center justify-center px-2 text-sm text-gray-700 flex-shrink-0">
          {activeField?.fieldName || '字段'} ▾
        </View>
      </Picker>

      <View className="flex-1 flex items-center bg-gray-100 border border-white/40 p-2 rounded-lg shadow-sm gap-2">
        <AtIcon value="search" className="text-gray-500" />
        <Input
          confirmType="search"
          className="flex-1 text-sm text-gray-800"
          placeholder="搜索关键词"
          placeholderStyle="color: rgba(0,0,0,0.3)"
          value={value}
          onInput={(e) => onInput(e.detail.value)}
          onConfirm={onSearch}
        />
      </View>
      <View className="text-md p-4 flex-shrink-0 text-blue-500 font-medium" onClick={onSearch}>
        搜索
      </View>
    </View>
  );
};

export default withGlobalLayout(SearchCustomerPage);