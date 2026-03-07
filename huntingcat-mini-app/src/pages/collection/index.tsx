import { View, Text, Input } from "@tarojs/components";
import { useState, useEffect } from "react";
import { CUSTOMER_INFO_LIST } from "../../constant/mock";
import { useNavbar } from "../../context/NavbarContext";
import { withGlobalLayout } from "../../utils/withGlobalLayout";
import { MockData } from "@/typing";
import { AtIcon, AtToast } from "taro-ui";
import Taro from "@tarojs/taro";

function FavoriteCustomerPage() {
  const { navBarHeight } = useNavbar();
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState<MockData.CustomerDataType[]>(CUSTOMER_INFO_LIST.slice(0,2));
  const [loading, setLoading] = useState(false);

  // 模拟获取收藏列表
  useEffect(() => {
    setLoading(true);
    // 实际业务逻辑：从 API 获取或从本地筛选标记了 favorite 的数据
    // const res = CUSTOMER_INFO_LIST.filter(item => item.isFavorite); 
    // setFavorites(res);
    setLoading(false);
  }, []);

  // 搜索过滤
  const displayData = favorites.filter(item => 
    item.companyName.includes(keyword) || item.contractName.includes(keyword)
  );

  // 处理取消收藏
  const handleToggleFavorite = (id: string) => {
    // 实际应调用后端接口
    Taro.showModal({
      title: '提示',
      content: '确定取消收藏该客户吗？',
      success: (res) => {
        if (res.confirm) {
          setFavorites(prev => prev.filter(item => item.key !== id));
          Taro.showToast({ title: '已取消', icon: 'none' });
        }
      }
    });
  };

  return (
    <View className="mesh-gradient min-h-screen pb-10">
      <AtToast isOpened={loading} status="loading" text="加载中" />
      
      {/* 顶部搜索 - 固定 */}
      <View className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-3" style={{ paddingTop: `${navBarHeight}px` }}>
        <View className="flex flex-col gap-2">
          <Text className="text-xl font-bold text-gray-800 px-1">我的收藏</Text>
          <SearchComponent value={keyword} onInput={setKeyword} />
        </View>
      </View>

      {/* 列表区域 */}
      <View className="p-3 flex flex-col gap-3">
        {displayData.length > 0 ? (
          displayData.map((item) => (
            <FavoriteCustomerCard 
              key={item.key} 
              data={item} 
              onUnfavorite={() => handleToggleFavorite(item.key)} 
            />
          ))
        ) : (
          <EmptyState keyword={keyword} />
        )}
      </View>
    </View>
  );
}
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

/**
 * 专供收藏页使用的卡片，带有取消收藏按钮
 */
const FavoriteCustomerCard: React.FC<{ 
  data: MockData.CustomerDataType, 
  onUnfavorite: () => void 
}> = ({ data, onUnfavorite }) => {
  return (
    <View className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur-md active:scale-[0.98] transition-transform">
      <View className="flex justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-xs text-gray-400 mb-1 block">企业客户</Text>
          <Text className="font-bold text-gray-800 text-lg leading-tight">{data.companyName}</Text>
        </View>
        <View onClick={onUnfavorite} className="p-2 -mr-2">
          <AtIcon value='star-2' size='20' color='#FBBF24' /> {/* 黄色实心星 */}
        </View>
      </View>

      <View className="grid grid-cols-1 gap-2 border-t border-gray-100/50 pt-3">
        <View className="flex items-center text-sm">
          <Text className="text-gray-400 w-16">联系人</Text>
          <Text className="text-gray-700 font-medium">{data.contractName}</Text>
        </View>
        <View className="flex items-center text-sm">
          <Text className="text-gray-400 w-16">手机号</Text>
          <Text className="text-blue-600 font-medium">{data.contractPhone}</Text>
        </View>
      </View>

      {/* 底部装饰条 */}
      <View className="absolute bottom-0 left-0 w-1 h-full bg-yellow-400" />
    </View>
  );
};

const EmptyState = ({ keyword }: { keyword: string }) => (
  <View className="py-20 flex flex-col items-center justify-center opacity-40">
    <AtIcon value='folder' size='60' color='#9CA3AF' />
    <Text className="mt-4 text-sm text-gray-500">
      {keyword ? '未搜索到相关收藏内容' : '暂无收藏客户'}
    </Text>
  </View>
);

export default withGlobalLayout(FavoriteCustomerPage);