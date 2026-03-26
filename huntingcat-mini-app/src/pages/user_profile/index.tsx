import { useState } from "react";
import { View, Text, Button, Input, Image } from "@tarojs/components";
import { withGlobalLayout } from "@/components/AppLayout";
import { ICON_MAP } from "@/constant/global";
import Taro from "@tarojs/taro";
import { updateUserProfile } from "@/services/steins-admin/systemUserController";
import { handleResponse, Notify } from "@/utils/common";
import storage from "@/utils/storage";
import HeaderBodyLayout from "@/components/layout/HeaderBodyLayout";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ApiResult } from "@/typing";

function UserProfilePage() {
  const userInfo = useSelector((state: RootState) => state.authModel.userInfo);
  const [avatar, setAvatar] = useState(
    userInfo.avatar || ICON_MAP.defaultAvatar,
  );
  const [nickname, setNickname] = useState(userInfo.nickName);

  // 处理头像选择
  const onChooseAvatar = async (e: any) => {
    const { avatarUrl } = e.detail;
    setAvatar(avatarUrl);
  };

  // 处理昵称输入（由于 input type="nickname" 在失去焦点时会触发变化）
  const onNicknameChange = (e: any) => {
    setNickname(e.detail.value);
  };

  const handleSave = async () => {
    Notify.loading("保存中...")
    // {avatar: "http://tmp/9G76GjfCgMNb6a133fdc51c20dde1707efc0ecbf5299.jpeg", nickname: "🚴🏻"}
    let resp: ApiResult;
    
    if (avatar.startsWith("http://tmp") || avatar.startsWith("wxfile")) {
      resp = await updateUserProfile(
        {
          nickName: nickname,
        },
        { uri: avatar } as any,
      );
    } else {
      resp = await updateUserProfile(
        {
          nickName: nickname,
        },
        null,
      );
    }
    handleResponse({
      resp,
      onSuccess: (data) => {
        Notify.ok("保存成功");
        storage.setItem("token", data);
      },
      onError: () => {
        Notify.fail("上传失败:" + resp.msg);
      },
    });
  };

  return (
    <HeaderBodyFooterLayout className="bg-gray-50">
      <View className="p-6 flex flex-col items-center bg-gray-50 min-h-screen">
        <View className="w-full bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-8 block text-center">
            完善个人资料
          </Text>

          {/* 头像选择区 */}
          <View className="flex flex-col items-center mb-8">
            <Button
              openType="chooseAvatar"
              onChooseAvatar={onChooseAvatar}
              className="w-24 h-24 p-2 m-0 bg-gray-100 flex flex-col items-center rounded-full "
            >
              <Image src={avatar} className="w-full h-full" mode="aspectFill" />
            </Button>
            <Text className="text-sm text-gray-400 mt-2">点击更换头像</Text>
          </View>

          {/* 昵称输入区 */}
          <View className="space-y-4">
            <View>
              <Text className="text-sm text-gray-500 mb-2 block ml-1">
                用户昵称
              </Text>
              <Input
                type="nickname" // 关键：触发微信昵称填充
                placeholder="请输入或选择昵称"
                value={nickname}
                onInput={onNicknameChange}
                onBlur={onNicknameChange}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300"
              />
            </View>

            {/* 保存按钮 */}
            <Button
              onClick={handleSave}
              className="w-full bg-active text-white rounded-xl py-1 mt-8 font-medium shadow-lg active:opacity-80 transition-opacity"
            >
              保存修改
            </Button>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-xs text-gray-400">
            微信授权将确保您的信息安全
          </Text>
        </View>
      </View>
    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(UserProfilePage);
