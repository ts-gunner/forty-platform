import { View, Text, Input } from "@tarojs/components";
import { useState, useEffect } from "react";
import { useNavbar } from "@/context/NavbarContext";
import { withGlobalLayout } from "@/components/AppLayout";
import { AtIcon, AtToast } from "taro-ui";
import Taro from "@tarojs/taro";
import { ROUTERS } from "@/constant/menus";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { getCustomerFavoriteList, removeCustomerFavorite } from "@/services/steins-admin/crmCustomerFavoriteController";
import { handleResponse, Notify } from "@/utils/common";
const CURRENT_PAGE = ROUTERS.collection;
function FavoriteCustomerPage() {
  const dispatch = useDispatch<Dispatch>()
  const activeRoute = useSelector((state: RootState) => state.routerModel.activeRoute)
  const { navBarHeight } = useNavbar();
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState<API.CrmCustomerFavoriteVo[]>([]);

  // 获取收藏列表
  useEffect(() => {
    getFavorites()
  }, [activeRoute]);
  const getFavorites = async () => {
    Notify.loading("加载中")
    const resp = await getCustomerFavoriteList({
      pageNum: 1,
      pageSize: 999,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setFavorites(data.list || []);
        Notify.clear()
      },
      onError: () => {
        Notify.fail("获取收藏列表失败");
      },

    });
  }
  // 搜索过滤
  const displayData = favorites.filter(item =>
    item.customerName?.includes(keyword) ||
    (item.values ? JSON.parse(item.values).contractName?.includes(keyword) : false)
  );

  // 处理取消收藏
  const handleToggleFavorite = (entityId: string, valueId: string) => {
    Taro.showModal({
      title: '提示',
      content: '确定取消收藏该客户吗？',
      success: async (res) => {
        if (res.confirm) {
          const resp = await removeCustomerFavorite({
            entityId: entityId,
            valueId: valueId,
          });
          handleResponse({
            resp,
            onSuccess: () => {
              getFavorites()
            },
            onError: () => {
              Notify.fail("取消收藏失败");
            },
          });
        }
      }
    });
  };

  return (
    <View className="mesh-gradient min-h-screen pb-10">

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
          displayData.map((item) => {
            let values = {};
            try {
              values = item.values ? JSON.parse(item.values) : {};
            } catch (e) {
              values = {};
            }
            return (
              <FavoriteCustomerCard
                key={item.valueId}
                data={{ ...item, ...values }}
                onClick={() => {
                  dispatch.crmModel.setSelectedEntityValue({
                    id: item.valueId,
                    entityId: item.entityId,
                    customerName: item.customerName,
                    remark: item.remark,
                    values: item.values,
                  });
                  dispatch.routerModel.navigateTo({ url: ROUTERS.customerDetail });
                }}
                onUnfavorite={() => handleToggleFavorite(item.entityId as string, item.valueId as string)}
              />
            );
          })
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
        placeholder="搜索企业..."
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
  data: any,
  onUnfavorite: () => void
  onClick?: () => void

}> = ({ data, onUnfavorite, onClick }) => {
  const dispatch = useDispatch<Dispatch>()
  return (
    <View className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur-md active:scale-[0.98] transition-transform">
      <View className="flex justify-between items-start mb-3">
        <View className="flex-1" onClick={onClick}>
          <Text className="text-xs text-gray-400 mb-1 block">{dispatch.crmModel.getFieldName("customer_name")}</Text>
          <Text className="font-bold text-gray-800 text-lg leading-tight">{data["customer_name"]}</Text>
        </View>
        <View onClick={onUnfavorite} className="p-2 -mr-2">
          <AtIcon value='star-2' size='20' color='#FBBF24' />
        </View>
      </View>

      <View className="grid grid-cols-1 gap-2 border-t border-gray-100/50 pt-3">
        <View className="flex items-center text-sm">
          <Text className="text-gray-400 w-16">{dispatch.crmModel.getFieldName("contract_name")}</Text>
          <Text className="text-gray-700 font-medium">{data["customer_name"]}</Text>
        </View>
        <View className="flex items-center text-sm">
          <Text className="text-gray-400 w-16">{dispatch.crmModel.getFieldName("contract_phone")}</Text>
          <Text className="text-blue-600 font-medium">{data["contract_phone"]}</Text>
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