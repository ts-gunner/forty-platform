import { login } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../store";
import { useNavbar } from "../../context/NavbarContext";
import { ICON_MAP, IMAGE_MAP } from "../../constant/global";
import NavHeaderBar from "../../components/nav-header/NavHeaderBar";

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
    <View className="relative">
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
          <View className="flex items-center gap-2">
            <View className="h-12 w-12 p-1 bg-black rounded-full">
              <Image src={ICON_MAP.defaultAvatar} className="h-full w-full" />
            </View>
            <Text className="font-bold tracking-wide">请点击登录</Text>
          </View>
          <View>
            <Image src={ICON_MAP.settingIcon} className="h-6 w-6" />
          </View>
        </View>
      </View>
    </View>
  );
}
