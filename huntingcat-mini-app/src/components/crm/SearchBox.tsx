import { Button, Input, Text, View } from "@tarojs/components";
import { useState } from "react";
import BusinessLogo from "../logo/BusinessLogo";
import { FilterComponent } from "./FilterBox";
import { APP_CONFIG } from "@/constant/global";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
export const SearchHeader: React.FC<{ mode: "mine" | "all" }> = ({ mode }) => {
  const [searchText, setSearchText] = useState<string>("");
  const dispatch = useDispatch<Dispatch>();

  return (
    <View className="w-full flex flex-col h-full justify-between items-center">
      <View className="w-full flex flex-col justify-center items-center gap-3 pt-20">
        <BusinessLogo
          title={APP_CONFIG.title}
          textClassName="text-white text-2xl font-mono"
        />
        <View className="w-[90%]">
          <SearchComponent
            value={searchText}
            onInput={setSearchText}
            onSearch={() => {
              dispatch.crmModel.handleSearchData({
                mode,
                text: searchText,
              });
            }}
          />
        </View>
      </View>
      <View className="w-full">
        <FilterComponent mode={mode} />
      </View>
    </View>
  );
};

/**
 * 搜索组件
 */
export const SearchComponent: React.FC<{
  value: string;
  onInput: (val: string) => void;
  onSearch: () => void;
}> = ({ value, onInput, onSearch }) => {
  return (
    <View className="flex items-center bg-white border border-white/40 rounded-xl p-2 shadow-sm">
      <Input
        confirmType="search"
        className="flex-1 text-sm text-gray-800"
        placeholder="搜索企业"
        placeholderStyle="color: rgba(0,0,0,0.3)"
        value={value}
        onInput={(e) => onInput(e.detail.value)}
        onConfirm={onSearch}
      />

      <Button className="text-sm bg-active py-1 text-white" onClick={onSearch}>
        搜索
      </Button>
    </View>
  );
};
