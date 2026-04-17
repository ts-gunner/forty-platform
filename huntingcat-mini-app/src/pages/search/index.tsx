import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { ROUTERS } from "@/constant/menus";
import { Dispatch, RootState } from "@/store";
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
  const dispatch = useDispatch<Dispatch>();
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
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
                let history = JSON.parse(memory);
                history.push(searchText);
                await storage.setItem(HISTORY_KEY, JSON.stringify(history));
              } catch {
                await storage.setItem(
                  "searchMemory",
                  JSON.stringify([searchText]),
                );
              }
            } else {
              await storage.setItem(
                "searchMemory",
                JSON.stringify([searchText]),
              );
            }
            refreshHistory();
            dispatch.crmModel.handleSearchData({
              text: searchText,
            });
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
                            storage.removeItem(HISTORY_KEY).then(res => {
                              setSearchHistory([])
                              setIsShowRemove(false)
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
                  onClick={() => setSearchText(it)}
                  className="py-2 px-4 bg-gray-100 text-gray-700 text-sm rounded-lg"
                >
                  {it}
                </View>
              ))}
            </View>
          </View>
        )}
        {searchLoading && (
          <View className="flex justify-center items-center gap-2 mt-2 text-gray-600">
            <AtIcon value="loading" className="animate-spin" />
            <Text>正在加载</Text>
          </View>
        )}
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
