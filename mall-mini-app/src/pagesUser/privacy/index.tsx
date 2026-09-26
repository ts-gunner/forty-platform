import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { Text, View } from "@tarojs/components";

export default function PrivacyPage() {
  return (
    <HeaderBodyFooterLayout>
      <View className="pb-10">
        <Text className="mb-5 block text-center text-3xl font-bold">
          隐私政策
        </Text>
        <Text className="mb-2 block text-center text-lg text-gray-500">
          更新日期：2026年04月10日
        </Text>
        <Text className="mb-8 block text-center text-lg text-gray-500">
          生效日期：2026年04月10日
        </Text>

        {/* 章节 1 */}
        <View className="mb-8">
          <Text className="mb-4 block text-2xl font-bold text-gray-800">
            一、引言
          </Text>
          <Text className="text-xl leading-loose text-gray-700">
            欢迎使用本微信小程序。本小程序由猎猫传媒开发运营，我们深知个人信息对你的重要性，我们将按照法律法规要求，保护你的个人信息及隐私安全。
          </Text>
        </View>

        {/* 章节 2 */}
        <View className="mb-8">
          <Text className="mb-4 block text-2xl font-bold text-gray-800">
            二、我们收集的信息
          </Text>
          <View className="flex flex-col gap-1">
            <Text className="text-xl leading-loose text-gray-700">
              1. 基础信息：微信昵称、头像等开放信息；
            </Text>
            <Text className="text-xl leading-loose text-gray-700">
              2. 权限信息：位置（仅你授权后使用）；
            </Text>
            <Text className="text-xl leading-loose text-gray-700">
              3. 仅用于实现小程序功能，不用于其他用途。
            </Text>
          </View>
        </View>

        {/* 章节 3 */}
        <View className="mb-8">
          <Text className="mb-4 block text-2xl font-bold text-gray-800">
            三、信息使用与保护
          </Text>
          <Text className="text-xl leading-loose text-gray-700">
            我们采用加密技术保护你的信息，不向第三方出售、出租个人信息，仅在法律法规要求下共享信息。
          </Text>
        </View>

        {/* 章节 4 */}
        <View className="mb-8">
          <Text className="mb-4 block text-2xl font-bold text-gray-800">
            四、用户权利
          </Text>
          <Text className="text-xl leading-loose text-gray-700">
            你可随时撤回授权、删除信息、注销账号，我们将依法保障你的权利。
          </Text>
        </View>

        {/* 章节 5 */}
        <View className="mb-8">
          <Text className="mb-4 block text-2xl font-bold text-gray-800">
            五、联系我们
          </Text>
          <Text className="text-xl leading-loose text-gray-700">
            运营主体：猎猫传媒 联系邮箱：yang995854654@outlook.com
          </Text>
        </View>
      </View>
    </HeaderBodyFooterLayout>
  );
}
