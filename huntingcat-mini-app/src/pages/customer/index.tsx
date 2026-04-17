import { ScrollView, View } from "@tarojs/components";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import Taro, {
  useReachBottom,
  useShareAppMessage,
  usePullDownRefresh,
  startPullDownRefresh,
  stopPullDownRefresh,
} from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { ROUTERS } from "@/constant/menus";
import HeaderBodyLayout from "@/components/layout/HeaderBodyLayout";
import { CustomerCard } from "@/components/crm/CustomerCard";
import { SearchHeader } from "@/components/crm/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { DEFAULT_CUSTOMER_DATA, ICON_MAP } from "@/constant/global";
import EmptyComponent from "@/components/EmptyComponent";
const CURRENT_PAGE = ROUTERS.customer;
function MyCustomerPage() {
  useShareAppMessage(() => {
    return {
      title: "查看我的客户",
      path: CURRENT_PAGE,
    };
  });
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo);
  const myCustomerData = useSelector(
    (state: RootState) => state.crmModel.myCustomerData,
  );
  const activeRoute = useSelector(
    (state: RootState) => state.routerModel.activeRoute,
  );
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (!activeRoute) {
      return;
    }

    if (CURRENT_PAGE === activeRoute) {
      getCrmDataBySelf();
    } else {
      // 跳转到其他页面时，注销数据
      dispatch.crmModel.initMyCustomerData();
    }
  }, [activeRoute]);
  const getCrmDataBySelf = async () => {
    await dispatch.crmModel.getEntityValues({ mode: "mine" });
  };
  usePullDownRefresh(async () => {
    try {
      dispatch.crmModel.setMyCustomerData(DEFAULT_CUSTOMER_DATA);
      setTimeout(() => {
        getCrmDataBySelf(); // 刷新数据
      }, 50);
    } finally {
      stopPullDownRefresh(); // 无论成功失败都关闭动画
    }
  });
  // 4. 触底加载更多
  useReachBottom(() => {
    dispatch.crmModel.setMyCustomerData({
      ...myCustomerData,
      current: myCustomerData.current + 1,
    });
  });

  useEffect(() => {
    if (CURRENT_PAGE === activeRoute) {
      getCrmDataBySelf();
    }
  }, [myCustomerData.current]);
  return (
    <HeaderBodyLayout
      headerHeight={230}
      rootClassName="bg-active"
      bodyClassName="pb-16 mesh-gradient rounded-t-2xl pt-2"
      headerComponent={<SearchHeader mode="mine" />}
    >
      <View className="p-3 flex flex-col gap-2 w-full">
        {Object.values(myCustomerData.data).flat().length === 0 && (
          <EmptyComponent
            btnText="刷新"
            icon={ICON_MAP.EmptyIcon}
            onBtnClick={() => {
              getCrmDataBySelf();
            }}
          />
        )}
        {Object.entries(myCustomerData.data).map(([cur, list], idx) => {
          return list.map((it) => (
            <CustomerCard
              mode="mine"
              key={idx}
              data={it}
              onClick={() => {
                dispatch.crmModel.setSelectedEntityValue(it);
                dispatch.routerModel.navigateTo({
                  url: ROUTERS.customerDetail,
                });
              }}
            />
          ));
        })}
      </View>
    </HeaderBodyLayout>
  );
}

export default withGlobalLayout(MyCustomerPage);
