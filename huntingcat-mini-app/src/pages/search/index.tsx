import { CustomerCard } from "@/components/crm/CustomerCard";
import EmptyComponent from "@/components/EmptyComponent";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { ROUTERS } from "@/constant/menus";
import { getEntityValueList } from "@/services/steins-admin/crmEntityValueController";
import { Dispatch, RootState } from "@/store";
import { handleResponse, Notify } from "@/utils/common";
import storage from "@/utils/storage";
import { Input, Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AtIcon } from "taro-ui";
const HISTORY_KEY = "searchMemory";
const CURRENT_PAGE = ROUTERS.searchCustomer;
export default function SearchCustomerPage() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isShowRemove, setIsShowRemove] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<API.CrmEntityValueVo[]>([]);
  const [searhTotal, setSearchTotal] = useState<number>(0);
  const [isEmpty, setEmpty] = useState<boolean>(false);
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
  const searchCustomerData = async (keyword: string) => {
    setEmpty(false);
    setSearchLoading(true);
    const resp = await getEntityValueList({
      entityKey: entityVo.entityCode,
      pageNum: 1,
      pageSize: 20,
      filterParams: {
        [activeField.fieldKey]: keyword,
      },
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setSearchResult(data.entityValue.list);
        setSearchTotal(data.entityValue.total);
        if (data.entityValue.total === 0) {
          setEmpty(true);
        }
      },
      onError: () => {
        Notify.fail(resp.msg);
      },
      onFinish: () => {
        setSearchLoading(false);
      },
    });
  };
  return (
    <HeaderBodyFooterLayout title="搜索">
      <View className="p-3">
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
                // 最多5个搜索历史记录
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
            searchCustomerData(searchText);
          }}
        />
        {!searchText && (
          <View className="mt-3">
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
                            storage.removeItem(HISTORY_KEY).then((res) => {
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
            {/* 历史记录 */}
            <View className="mt-4 flex items-center gap-3 flex-wrap">
              {searchHistory.map((it, idx) => (
                <View
                  key={idx}
                  onClick={() => {
                    setSearchText(it);
                    searchCustomerData(it);
                  }}
                  className="py-2 px-4 bg-gray-100 text-gray-700 text-sm rounded-lg"
                >
                  {it}
                </View>
              ))}
            </View>
            {searchResult.length > 0 && (
              <View className="mt-3 flex items-center text-sm">
                <Text>搜索到</Text>
                <Text className="text-red-500">{searhTotal}</Text>
                <Text>条结果</Text>
              </View>
            )}
          </View>
        )}
        {searchLoading && (
          <View className="flex justify-center items-center gap-2 mt-2 text-gray-600">
            <AtIcon value="loading" className="animate-spin" />
            <Text>正在加载</Text>
          </View>
        )}

        <View className="p-3 flex flex-col gap-2 w-full">
          {searchResult.map((it, idx) => {
            return (
              <CustomerCard
                mode="all"
                key={idx}
                data={it}
                onClick={() => {
                  dispatch.crmModel.setSelectedEntityValue(it);
                  dispatch.routerModel.navigateTo({
                    url: ROUTERS.customerDetail,
                  });
                }}
              />
            );
          })}
        </View>
        {isEmpty && <EmptyComponent />}
      </View>
    </HeaderBodyFooterLayout>
  );
}

export const SearchComponent: React.FC<{
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
    <View className="flex items-center w-full border-t border-b border-gray-100">
      <Picker
        mode="selector"
        range={tableFields.map((item) => item.fieldName)}
        value={activeFieldIndex}
        onChange={(e) => {
          setActiveField(tableFields[e.detail.value]);
        }}
      >
        <View className="flex items-center justify-center px-2 text-sm text-gray-700 flex-shrink-0">
          {activeField.fieldName} ▾
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
      <View className="text-md p-4 flex-shrink-0" onClick={onSearch}>
        搜索
      </View>
    </View>
  );
};
