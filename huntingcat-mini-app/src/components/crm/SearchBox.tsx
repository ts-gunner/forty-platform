import { Input, Text, View } from "@tarojs/components";
import { useState } from "react";
import { AtIcon } from "taro-ui";
import BusinessLogo from "../logo/BusinessLogo";
import { FilterComponent } from "./FilterBox";
import { APP_CONFIG } from "@/constant/global";
import { Notify } from "@/utils/common";
export const SearchHeader: React.FC<{mode: "mine"| "all"}> = ({mode}) => {
  const [keyword, setKeyword] = useState("");
  return (
    <View className="w-full flex flex-col h-full justify-between items-center">
      <View className="w-full flex flex-col justify-center items-center gap-3 pt-20">
        <BusinessLogo title={APP_CONFIG.title} textClassName="text-white text-2xl font-mono"/>
        <View className="w-[90%]">
          <SearchComponent value={keyword} onInput={setKeyword} />
        </View>
      </View>
      <View className="w-full">
        <FilterComponent mode={mode}/>
      </View>
    </View>
  )
}


/**
 * 搜索组件
 */
export const SearchComponent: React.FC<{
  value: string;
  onInput: (val: string) => void;
}> = ({ value, onInput }) => {
  return (
    <View className="flex items-center bg-white border border-white/40 rounded-xl px-4 py-2 shadow-sm">
      <View className="mr-2 opacity-50">
        <AtIcon value="search" />
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