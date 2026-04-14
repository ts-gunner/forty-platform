import { Image, Text, View } from "@tarojs/components";
import { useNavbar } from "@/context/NavbarContext";
import { ICON_MAP, IMAGE_MAP, THEME_CONFIG } from "@/constant/global";
import { cn, handleResponse, Notify } from "@/utils/common";
import { ROUTERS } from "@/constant/menus";
import { withGlobalLayout } from "@/components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { uploadCrmExcel } from "@/services/steins-admin/crmEntityValueController";
const CURRENT_PAGE = ROUTERS.mine;
function UserPage() {
  const dispatch = useDispatch<Dispatch>()
  const activeRoute = useSelector((state:RootState) => state.routerModel.activeRoute)
  const [statistic, setStatistic] = useState<API.CrmValueCountVo>({})
  const { navBarHeight } = useNavbar();
useEffect(() => {
    if (!activeRoute) {
      return;
    }

    if (CURRENT_PAGE === activeRoute) {
      getCountData()

    } else {
    }
  }, [activeRoute]);

  const getCountData = async () => {
    let data = await dispatch.crmModel.countValue(null)
    setStatistic(data)

  }
  return (
    <View className="mesh-gradient relative bg-gray-100/50 min-h-screen">
      <View
        className="relative z-[999]"
        style={{
          paddingTop: `${navBarHeight}px`,
        }}
      >
        <View className="flex justify-between items-center px-4">
          <UserComponent />

          <View className="flex items-center gap-2">
            <CardComponent
              icon={<Image src={ICON_MAP.settingIcon} className="h-6 w-6" />}
              title="设置"
              className="gap-0 text-sm"
              onClick={() => {
                dispatch.routerModel.navigateTo({ url: ROUTERS.settings });
              }}
            />
          </View>
        </View>
        <StatsSection  allCrmCount={statistic.allValueCount || 0} myCrmCount={statistic.mineValueCount || 0}/>
        <MyServiceComponent />
      </View>
    </View>
  );
}
const StatsSection = ({allCrmCount, myCrmCount}: {allCrmCount: number, myCrmCount: number}) => {
  const dispatch = useDispatch<Dispatch>()

  return (
    <View className="px-2 py-2">
      <View
        className="flex justify-between items-center rounded-2xl p-4 shadow-lg bg-active"
      >
        {[
          { label: '客户总数', count: allCrmCount },
          { label: '我的客户', count: myCrmCount },
        ].map((item, i, arr) => (
          <View key={i} className="flex flex-col items-center flex-1">
            {/* 数据值：大字突出 */}
            <Text className="text-white text-xl font-bold mb-1">{item.count}</Text>
            {/* 标签：小字半透明 */}
            <Text className="text-white/70 text-xs">{item.label}</Text>

            {/* 分隔线：除了最后一项，每项右侧加一条淡色竖线 */}
            {i !== arr.length - 1 && (
              <View className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-white/20" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// 左上角的用户信息
const UserComponent = () => {
  const userInfo = useSelector((state: RootState) => state.authModel.userInfo)
  return (
    <View
      className="flex items-center gap-3 active:opacity-70"
    // onTap={onPress}
    >

      <View className={cn(
        `h-16 w-16 overflow-hidden rounded-full border border-gray-100 bg-gray-100 shadow-lg `,
        !userInfo.avatar && "p-3"
      )}>
        <Image
          src={userInfo.avatar || ICON_MAP.defaultAvatar}
          lazyLoad
          className="h-full w-full"
        />
      </View>

      {/* 文字描述 */}
      <Text className="text-gray-800 font-medium text-base tracking-tight">
        {userInfo?.nickName}
      </Text>
    </View>
  );
};


// 我的服务
const MyServiceComponent = () => {
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo)
  const dispatch = useDispatch<Dispatch>()
const serviceData = [
  {
    key: "1",
    title: "导入数据",
    icon: <Image src={ICON_MAP.uploadExcel} lazyLoad className="h-6 w-6" />,
    onClick: () => {
      Taro.chooseMessageFile({
        count: 1,
        type: "file",
        success: async (res) => {
          const tempFilePaths = res.tempFiles
          const tempFile = tempFilePaths[0]
          const resp = await uploadCrmExcel({
            entityId: entityVo.entityId
          }, { uri: tempFile.path } as any,)
          handleResponse({
            resp,
            onSuccess: () => {
              Notify.ok("导入成功")
            },
            onError: () => {
              Notify.fail(resp.msg)
            }
          })
        }
      })
    }
  },
  {
    key: "2",
    title: "审批",
    icon: <Image src={ICON_MAP.auditIcon} lazyLoad className="h-6 w-6" />,
    onClick: () => {
      dispatch.routerModel.navigateTo({url: ROUTERS.audit})
    },
  },

];
  return (
    <View className="flex justify-center mt-4">
      <View className="rounded-xl p-3 bg-white w-[95%] shadow">
        <Text className="font-[600]">我的服务</Text>
        <View className="grid grid-cols-4 mt-6 gap-2 gap-y-6">
          {serviceData.map((it) => (
            <CardComponent key={it.key} icon={it.icon} title={it.title} onClick={it.onClick}/>
          ))}
        </View>
      </View>
    </View>
  );
};



const CardComponent = ({
  icon,
  title,
  className,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <View
      className={cn(
        "flex flex-col gap-2 justify-center items-center",
        className,
      )}
      onClick={onClick}
    >
      {icon}
      <Text className="text-[0.9em]">{title}</Text>
    </View>
  );
};

export default withGlobalLayout(UserPage);
