import { Button, Input, Text, View } from "@tarojs/components";
import BusinessLogo from "../logo/BusinessLogo";
import { FilterComponent } from "./FilterBox";
import { APP_CONFIG } from "@/constant/global";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { AtIcon } from "taro-ui";
import { ROUTERS } from "@/constant/menus";
export const SearchHeader: React.FC<{ mode: "mine" | "all" }> = ({ mode }) => {

  return (
    <View className="w-full flex flex-col h-full justify-between items-center">
      <View className="w-full flex flex-col justify-center items-center gap-3 pt-20">
        <BusinessLogo
          title={APP_CONFIG.title}
          textClassName="text-white text-2xl font-mono"
        />
        <View className="w-[90%]">
          <SearchComponent
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
  
}> = () => {
  const dispatch = useDispatch<Dispatch>()
  return (
    <View className="flex items-center bg-white border border-white/40 rounded-lg py-4 px-2 shadow-sm gap-2" onClick={()=> {
      dispatch.routerModel.navigateTo({url: ROUTERS.searchCustomer})
    }}>
      <AtIcon value="search" className="text-gray-500"/>
      <Input
        confirmType="search"
        className="flex-1 text-sm text-gray-800"
        placeholder="输入搜索关键词"
        placeholderStyle="color: rgba(0,0,0,0.3)"
        // value={value}
        // onInput={(e) => onInput(e.detail.value)}
        // onConfirm={onSearch}
      />


    </View>
  );
};
