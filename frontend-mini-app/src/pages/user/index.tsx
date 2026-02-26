import { login } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../store";
import { useNavbar } from "../../context/NavbarContext";
import { ICON_MAP, IMAGE_MAP } from "../../constant/global";
import { cn } from "../../utils/common";
import { MORE_FUNCTION_ICONS, MY_ORDER_ICONS, MY_SERVICE_ICONS } from "../../constant/mock";

export default function UserPage() {
  const dispatch = useDispatch<Dispatch>();
  const { navBarHeight } = useNavbar();
  const isAuth = useSelector((state: RootState) => state.authModel.isAuth);
  const authLoading = useSelector(
    (state: RootState) => state.authModel.authLoading,
  );
  const userInfo = useSelector((state: RootState) => state.authModel.userInfo);
  const userLogin = () => {
    login({
      success: (res: any) => {
        if (res.code) {
          dispatch.authModel.userLogin(res.code);
        }
      },
    });
  };
  return (
    <View className="relative bg-gray-100/50 min-h-screen">
      <View className="absolute w-screen z-1">
        <Image
          src={IMAGE_MAP.userHeaderBackground}
          className="w-full"
          mode="scaleToFill"
        />
        {/* 渐变蒙版 */}
        <View
          className="absolute bottom-0 left-0 right-0 h-16 z-5 blur-sm"
          style={{
            // 调整渐变参数，让过渡更自然
            background: "linear-gradient(to top, rgb(255, 255, 255, 2), rgba(226, 225, 225, 0))",
          }}
        />
      </View>
      <View
        className="relative z-[999]"
        style={{
          paddingTop: `${navBarHeight}px`,
        }}
      >
        <View className="flex justify-between items-center px-4">
          <UserComponent />

          <View className="flex items-center gap-4">
            <CardComponent icon={<Image src={ICON_MAP.takeCareMode} className="h-6 w-6" />} title="关怀版" className="gap-0 text-sm" />
            <CardComponent icon={<Image src={ICON_MAP.settingIcon} className="h-6 w-6" />} title="设置" className="gap-0 text-sm" />
          </View>
        </View>
        <MyOrderComponent />
        <MyServiceComponent />
        <MoreFunctionComponent />
      </View>
    </View>
  );
}


// 左上角的用户信息
const UserComponent = () => {
  return (
    <View className="flex items-center gap-2">
      <View className="h-12 w-12 p-2 bg-gray-300 rounded-full">
        <Image src={ICON_MAP.defaultAvatar} className="h-full w-full" />
      </View>
      <Text className="font-bold tracking-wide">请点击登录</Text>
    </View>
  )
}

// 我的订单
const MyOrderComponent = () => {

  return (
    <View className="flex justify-center mt-4">
      <View className="rounded-xl p-3 bg-white w-[95%] shadow">
        <Text className="font-[600]">我的订单</Text>
        <View className="grid grid-cols-4 mt-6 ">
          {
            MY_ORDER_ICONS.map(it => (
              <CardComponent key={it.key} icon={it.icon} title={it.title} className="text-sm gap-1" />
            ))
          }
        </View>
      </View>
    </View>
  )
}

// 我的服务
const MyServiceComponent = () => {
  return (
    <View className="flex justify-center mt-4">
      <View className="rounded-xl p-3 bg-white w-[95%] shadow">
        <Text className="font-[600]">我的服务</Text>
        <View className="grid grid-cols-4 mt-6 gap-2 gap-y-6">
          {
            MY_SERVICE_ICONS.map(it => (
              <CardComponent key={it.key} icon={it.icon} title={it.title} />
            ))
          }
        </View>
      </View>
    </View>

  )
}


// 更多功能
const MoreFunctionComponent = () => {
  return (
    <View className="flex justify-center mt-4">
      <View className="rounded-xl p-3 bg-white w-[95%] shadow">
        <Text className="font-[600]">更多功能</Text>
        <View className="grid grid-cols-4 mt-6 gap-2 gap-y-6">
          {
            MORE_FUNCTION_ICONS.map(it => (
              <CardComponent key={it.key} icon={it.icon} title={it.title} />
            ))
          }
        </View>
      </View>
    </View>

  )
}

const CardComponent = ({ icon, title, className }: { icon: React.ReactNode, title: string, className?: string }) => {

  return (
    <View className={cn("flex flex-col gap-2 justify-center items-center", className)}>
      {icon}
      <Text className="text-[0.9em]">{title}</Text>
    </View>
  )
}