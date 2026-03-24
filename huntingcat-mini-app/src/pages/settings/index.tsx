import React from "react";
import { View, Text, Switch, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { THEME_CONFIG } from "@/constant/global";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { useDispatch } from "react-redux";
import { Dispatch } from "@/store";
import { withGlobalLayout } from "@/components/AppLayout";
import { ROUTERS } from "@/constant/menus";

// 定义列表项类型
interface SettingItem {
  id: string;
  label: string;
  type: "arrow" | "switch" | "text";
  value?: string;
  checked?: boolean;
  icon?: string;
  onClick?: () => void;
}

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<Dispatch>();
  // 模拟数据
  const menuGroups: SettingItem[][] = [
    [
      {
        id: "profile",
        label: "个人资料",
        type: "arrow",
        onClick: () => {
          dispatch.routerModel.navigateTo({url: ROUTERS.userProfile });
        },
      },
      { id: "account", label: "账号与安全", type: "arrow" },
    ],
    [
      { id: "notify", label: "消息通知", type: "switch", checked: true },
      { id: "darkmode", label: "深色模式", type: "switch", checked: false },
      { id: "cache", label: "清理缓存", type: "text", value: "128MB" },
    ],
    [{ id: "about", label: "关于我们", type: "arrow" }],
  ];

  const handleNavigate = (id: string) => {
    Taro.showToast({ title: `点击了 ${id}`, icon: "none" });
  };
  const doLogout = () => {
    dispatch.authModel.doLogout();
  };
  return (
    <HeaderBodyFooterLayout>
      <>
        {/* 循环渲染分组 */}
        {menuGroups.map((group, gIndex) => (
          <View
            key={gIndex}
            className="mb-4 bg-white border-t border-b border-gray-200"
          >
            {group.map((item, iIndex) => (
              <View
                key={item.id}
                onClick={() => item.type !== "switch" && item.onClick()}
                className={`flex flex-row items-center justify-between px-4 py-4 active:bg-gray-50 ${
                  iIndex !== group.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <Text className="text-base text-gray-700">{item.label}</Text>

                <View className="flex flex-row items-center">
                  {/* 根据类型渲染右侧内容 */}
                  {item.type === "switch" && (
                    <Switch
                      checked={item.checked}
                      color={THEME_CONFIG.active}
                      onChange={(e) => console.log(item.id, e.detail.value)}
                    />
                  )}

                  {item.type === "text" && (
                    <Text className="text-sm text-gray-400 mr-1">
                      {item.value}
                    </Text>
                  )}

                  {(item.type === "arrow" || item.type === "text") && (
                    <View className="w-4 h-4 border-t-2 border-r-2 border-gray-300 transform rotate-45 ml-2" />
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* 退出登录按钮 */}
        <View className="mt-8 px-4">
          <View
            className="bg-white py-4 rounded-xl flex items-center justify-center active:opacity-70 border border-red-100"
            onClick={async () => {
              const res = await Taro.showModal({
                title: "提示",
                content: "确定退出登录吗？",
              });
              if (res.confirm) {
                doLogout();
              }
            }}
          >
            <Text className="text-red-500 font-medium text-lg">退出登录</Text>
          </View>
        </View>

        <View className="mt-6 flex justify-center">
          <Text className="text-xs text-gray-400">版本号 2.1.0</Text>
        </View>
      </>
    </HeaderBodyFooterLayout>
  );
};

export default withGlobalLayout(SettingsPage);
