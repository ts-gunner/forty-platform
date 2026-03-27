import { deleteEntityValue } from "@/services/steins-admin/crmEntityValueController";
import { Dispatch } from "@/store";
import { cn, handleResponse, Notify } from "@/utils/common";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AtIcon } from "taro-ui";
interface ActionItem {
  title: string;
  bg: string; // 背景类名
  icon: string; // 图标名称
  onClick?: () => void;
}

export const CustomerCard: React.FC<{
  mode: "mine" | "all";
  data: API.CrmEntityValueVo;
  onClick: (key: string) => void;
}> = ({ mode, data, onClick }) => {
  const dispatch = useDispatch<Dispatch>();
  const dataObject = JSON.parse(data.values);
  const actions = [
    {
      title: "更多",
      bg: "bg-gray-400",
      icon: "menu",
      onClick: () => {
        Taro.showActionSheet({
          itemList: ["移入"],
        });
      },
    },
    // {
    //   title: "收藏",
    //   bg: "bg-amber-700",
    //   icon: "star",
    //   onClick: () => {
    //     dispatch.crmModel.handleFavoriteCustomer({
    //       mode: "mine",
    //       value: data
    //     })
    //   }
    // },
    {
      title: "删除",
      bg: "bg-red-500",
      icon: "trash",
      onClick: () => {
        Taro.showActionSheet({
          itemList: ["删除内容"],
          itemColor: "#ff4d4f", // 危险操作设为红色
          success: async (res) => {
            if (res.tapIndex === 0) {
              const resp = await deleteEntityValue({
                id: data.id,
              });
              handleResponse({
                resp,
                onSuccess: () => {
                  Notify.ok("删除成功!");
                  dispatch.crmModel.getEntityValues({ mode: "mine" });
                },
                onError: () => {
                  Notify.fail("删除失败：" + resp.msg);
                },
              });
            }
          },
        });
      },
    },
  ];
  const CustomerBaseInfo = BaseCustomerCard(actions)(() => {
    return (
      <>
        <View className="space-y-2">
          <InfoItem
            label={dispatch.crmModel.getFieldName("contract_name")}
            value={dataObject["contract_name"]}
          />
          <InfoItem
            label={dispatch.crmModel.getFieldName("contract_phone")}
            value={dataObject["contract_phone"]}
          />
          <InfoItem
            label={dispatch.crmModel.getFieldName("detail_addr")}
            value={dataObject["detail_addr"]}
          />
        </View>
        {mode === "all" && (
          <>
            {/* 分隔虚线或细线 */}
            <View className="h-[1px] w-full border-t border-dashed border-gray-200 mb-3" />

            {/* 底部：归属业务员信息 */}
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                {/* 业务员头像占位/图标 */}
                <View className="w-6 h-6 rounded-full bg-active flex items-center justify-center mr-2">
                  <Text className="text-[18rpx] text-white font-bold">责</Text>
                </View>
                <View>
                  <Text className="text-[20rpx] text-gray-400">业务员:</Text>
                  <Text className="text-[24rpx] font-semibold text-gray-700">
                    {data.userName}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </>
    );
  });

  return (
    <View
      onClick={() => onClick(data.id)}
      className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-md mb-1"
    >
      {/* 顶部：公司名与状态标签 */}
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-[20rpx] text-gray-400 block mb-0.5">
            {dispatch.crmModel.getFieldName("customer_name")}
          </Text>
          <Text className="text-[32rpx] font-bold text-gray-800 leading-tight">
            {dataObject["customer_name"]}
          </Text>
        </View>
        {/* 标签 */}
        <View className="px-3 py-2 rounded-full bg-active shadow-sm flex items-center justify-center">
          <Text className="text-[22rpx] font-medium text-white">
            {dataObject["customer_type"]}
          </Text>
        </View>
      </View>

      <CustomerBaseInfo />
    </View>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex text-sm">
    <Text className="text-gray-400 w-16 flex-shrink-0">{label}</Text>
    <Text className="text-gray-600 font-medium">{value}</Text>
  </View>
);

function BaseCustomerCard(actions: ActionItem[]) {
  return <T extends {}>(WrappedComponent: React.ComponentType<T>) => {
    return (props: T) => {
      // 触摸起始X坐标
      const [startX, setStartX] = useState(0);
      // 卡片X轴偏移量（负值=左滑）
      const [offsetX, setOffsetX] = useState(0);

      const actionWidth = 60;
      // 最大滑动距离
      const MAX_SLIDE = actions.length * actionWidth;
      // 触摸开始：记录起始位置
      const handleTouchStart = (e: any) => {
        const touch = e.touches[0];
        setStartX(touch.clientX);
      };

      // 触摸移动：计算偏移量，限制滑动范围
      const handleTouchMove = (e: any) => {
        const touch = e.touches[0];
        const moveX = touch.clientX - startX;
        let newOffsetX = moveX < 0 ? Math.max(moveX, -MAX_SLIDE) : 0;
        setOffsetX(newOffsetX);
        e.preventDefault && e.preventDefault();
      };
      // 触摸结束：判断阈值，回弹/固定展开
      const handleTouchEnd = () => {
        if (offsetX > -MAX_SLIDE) {
          // 未达阈值 → 回弹关闭
          setOffsetX(0);
        } else {
          // 达到阈值 → 固定展开删除按钮
          setOffsetX(-MAX_SLIDE);
        }
      };

      return (
        <View className="relative">
          <View
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="duration-100"
            style={{ transform: `translateX(${offsetX}px)` }}
          >
            <WrappedComponent {...(props as T)} />
          </View>
          {-offsetX > 0 && (
            <View
              className="absolute bottom-0 top-0 right-0 flex items-center"
              style={{
                width: `${offsetX}px`,
              }}
            >
              {actions.map((it) => (
                <View
                  key={it.title}
                  onClick={(e: any) => {
                    e.stopPropagation()
                    it.onClick()
                  }}
                  className={cn(
                    "h-full flex flex-col items-center justify-center gap-1 transition-opacity",
                    it.bg,
                  )}
                  style={{ width: `${actionWidth}px` }}
                >
                  <AtIcon value={it.icon} className="text-white" size={16} />
                  <Text className="text-white text-[0.9em]">{it.title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    };
  };
}
