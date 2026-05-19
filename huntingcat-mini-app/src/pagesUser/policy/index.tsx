import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { Text, View } from "@tarojs/components";

export default function PolicyPage() {
  return (
    <HeaderBodyFooterLayout>
      <View className="pb-10">
        <View className="text-center font-bold text-3xl">用户服务协议</View>
        <Text className="mb-8 block text-center text-lg text-gray-500">
          生效日期：2026年04月10日 | 发布日期：2026年04月10日
        </Text>

        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            一、协议确认与接受
          </Text>
          <Text className="text-base leading-relaxed text-gray-700">
            1.
            本协议是你与猎猫传媒运营方之间，关于使用本小程序服务所订立的协议。
            2.
            本运营方有权根据需要修改协议条款，更新后将在小程序内公示，公示后生效。
          </Text>
        </View>

        {/* 二、服务说明 */}
        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            二、服务说明
          </Text>
          <Text className="text-base leading-relaxed text-gray-700">
            1. 本小程序为你提供管理客户信息工具。 2.
            本小程序不保证服务不会中断，因设备维修、网络调整、不可抗力等原因导致的服务暂停，我们不承担责任。
            3.
            你可自主选择使用本小程序的功能，部分功能可能需要你授权相关权限后使用。
          </Text>
        </View>

        {/* 三、用户账号与使用规范 */}
        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            三、用户账号与使用规范
          </Text>
          <Text className="text-base leading-relaxed text-gray-700">
            1. 你可通过微信授权登录本小程序，无需单独注册账号。 2.
            你不得使用本小程序从事违法违规行为，包括但不限于：发布违法信息、攻击他人、侵犯知识产权等。
            3. 你不得利用本小程序进行商业广告、垃圾信息传播等未经允许的行为。 4.
            如你违反本条款，我们有权暂停或终止为你提供服务。
          </Text>
        </View>

        {/* 四、用户权限与隐私 */}
        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            四、用户权限与隐私保护
          </Text>
          <Text className="text-base leading-relaxed text-gray-700">
            1.
            为实现功能，本小程序可能需要你授权：微信昵称、头像、设备信息、位置、相机、相册等权限。
            2.
            我们将按照《隐私政策》保护你的个人信息，不会非法收集、使用、泄露你的信息。
            3. 你可随时在小程序内撤回已授权的权限，撤回后不影响你使用基础功能。
          </Text>
        </View>

        {/* 五、知识产权 */}
        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            五、知识产权
          </Text>
          <Text className="text-base leading-relaxed text-gray-700">
            1.
            本小程序内的文字、图片、代码、界面设计、图标等全部内容知识产权均归运营方所有。
            2. 未经允许，你不得复制、修改、传播、商用本小程序内的任何内容。 3.
            如你侵犯知识产权，我们将追究法律责任。
          </Text>
        </View>

        {/* 六、免责声明 */}
        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            六、免责声明
          </Text>
          <Text className="text-base leading-relaxed text-gray-700">
            1.
            因网络故障、第三方服务、不可抗力导致的服务异常，我们不承担赔偿责任。
            2. 你因自身操作不当、手机设备问题导致的损失，由你自行承担。 3.
            本小程序仅提供相关服务，不对用户发布的内容真实性、合法性负责。
          </Text>
        </View>

        {/* 七、服务变更、中断与终止 */}
        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            七、服务变更、中断与终止
          </Text>
          <Text className="text-base leading-relaxed text-gray-700">
            1. 我们可根据业务调整，变更、暂停或终止部分/全部服务。 2.
            你违反本协议，我们有权立即终止服务并保留追责权利。 3.
            服务终止后，你的账号将无法登录，已收集信息按《隐私政策》处理。
          </Text>
        </View>

        {/* 八、联系我们 */}
        <View className="mb-8">
          <Text className="mb-3 block text-xl font-bold text-gray-800">
            八、联系我们
          </Text>
          <View className="flex flex-col gap-1">
            <Text className="text-base leading-relaxed text-gray-700">
              运营主体：猎猫传媒
            </Text>
            <Text className="text-base leading-relaxed text-gray-700">
              联系邮箱：yang995854654@outlook.com
            </Text>
            <Text className="text-base leading-relaxed text-gray-700">
              联系电话：13826137494
            </Text>
          </View>
        </View>
      </View>
    </HeaderBodyFooterLayout>
  );
}
