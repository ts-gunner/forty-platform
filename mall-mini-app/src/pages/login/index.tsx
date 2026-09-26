import { useDispatch } from "react-redux";
import { ICON_MAP, THEME_CONFIG } from "@/constant/global";
import { Button, View, Image, Text, Radio } from "@tarojs/components";
import Taro, { login } from "@tarojs/taro";
import { Dispatch } from "@/store";
import { withGlobalLayout } from "@/components/AppLayout";
import { useState } from "react";
import { Notify } from "@/utils/common";
import { ROUTERS } from "@/constant/menus";
function LoginPage() {
  const [isAllow, setIsAllow] = useState<boolean>(false);
  const dispatch = useDispatch<Dispatch>();
  const doLogin = () => {
    if (!isAllow) {
      Notify.fail("需要同意授权后登录");
      return;
    }
    login({
      success: (res: any) => {
        if (res.code) {
          dispatch.authModel.userLogin(res.code);
        }
      },
    });
  };
  return (
    <View className="h-screen flex flex-col justify-center items-center gap-14">
      <View className="flex justify-center items-center">
        <View className="relative">
          <View className="absolute -inset-12 bg-gradient-to-r from-yellow-300/40 via-orange-300/30 to-pink-400/20 blur-3xl rounded-full animate-pulse-slow" />
          <View className="absolute -inset-8 bg-gradient-to-tr from-amber-200/20 to-transparent blur-xl" />

          <Image
            src={ICON_MAP.loginLogo}
            lazyLoad
            className="relative z-10 w-64 h-64 object-contain drop-shadow-2xl"
            mode="aspectFill"
          />
        </View>
      </View>
      <View className="flex flex-col items-center mb-16 space-y-3">
        <Text className="text-3xl font-bold text-gray-800 tracking-wide">
          欢迎回来！
        </Text>
        <Text className="text-gray-400 text-base">
          管理你的客户资源，掌控业务全局
        </Text>
      </View>
      <Button
        className="w-[90%] text-white font-bold text-center rounded-full bg-active"
        onClick={doLogin}
      >
        一键登录
      </Button>
      <Text
        className="text-active text-center"
        onClick={() => dispatch.routerModel.navigateTo({url: ROUTERS.accessPermission})}
      >
        申请内部使用
      </Text>
      <View className="flex flex-row justify-center items-center mt-4">
        <Radio
          color={THEME_CONFIG.active}
          checked={isAllow}
          onClick={() => {
            setIsAllow(!isAllow);
          }}
        />
        <Text className="text-xs text-gray-400">登录即代表同意</Text>
        <Text
          className="text-xs text-orange-400 font-medium"
          onClick={() => {
            dispatch.routerModel.navigateTo({ url: ROUTERS.policy });
          }}
        >
          《用户协议》
        </Text>
        <Text className="text-xs text-gray-400">与</Text>
        <Text
          className="text-xs text-orange-400 font-medium"
          onClick={() => {
            dispatch.routerModel.navigateTo({ url: ROUTERS.privacy });
          }}
        >
          《隐私政策》
        </Text>
      </View>
    </View>
  );
}

export default withGlobalLayout(LoginPage);
