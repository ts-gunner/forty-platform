import { View } from "@tarojs/components";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { ROUTERS } from "@/constant/menus";
import HeaderBodyLayout from "@/components/layout/HeaderBodyLayout";
import { CustomerCard } from "@/components/crm/CustomerCard";
import { SearchHeader } from "@/components/crm/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import EmptyComponent from "@/components/EmptyComponent";
import { ICON_MAP } from "@/constant/global";
const CURRENT_PAGE = ROUTERS.allCustomer;
function AllCustomerPage() {
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo);
  const allCustomerData = useSelector(
    (state: RootState) => state.crmModel.allCustomerData,
  );
  const activeRoute = useSelector(
    (state: RootState) => state.routerModel.activeRoute,
  );
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (tableFields === undefined) {
      dispatch.crmModel.getCrmFields();
    }
    if (entityVo === undefined) {
      dispatch.crmModel.getEntityObject();
    }
    if (!activeRoute) {
      return;
    }
    if (CURRENT_PAGE === activeRoute) {
      getAllCrmData();
    } else {
      // 跳转到其他页面时，注销数据
      dispatch.crmModel.initAllCustomerData();
    }
  }, [activeRoute]);
  // 4. 触底加载更多
  useReachBottom(() => {
    dispatch.crmModel.setAllCustomerData({
      ...allCustomerData,
      current: allCustomerData.current + 1,
    });
  });
  useEffect(() => {
    if (CURRENT_PAGE === activeRoute) {
      getAllCrmData();
    }
  }, [allCustomerData.current]);
  const getAllCrmData = async () => {
    await dispatch.crmModel.getEntityValues({ mode: "all" });
  };
  return (
    <HeaderBodyLayout
      headerHeight={230}
      rootClassName="bg-active"
      bodyClassName="pb-16 mesh-gradient rounded-t-2xl pt-2"
      headerComponent={<SearchHeader mode="all" />}
    >
      <View className="p-3 flex flex-col gap-2 w-full">
        {Object.values(allCustomerData.data).flat().length === 0 && (
          <EmptyComponent
            btnText="刷新"
            icon={ICON_MAP.EmptyIcon}
            onBtnClick={() => {
              getAllCrmData();
            }}
          />
        )}
        {Object.entries(allCustomerData.data).map(([cur, list], idx) => {
          return list.map((it) => (
            <CustomerCard
              mode="all"
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

export default withGlobalLayout(AllCustomerPage);
