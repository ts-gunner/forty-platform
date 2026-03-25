import { View } from "@tarojs/components";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { ROUTERS } from "@/constant/menus";
import HeaderBodyLayout from "@/components/layout/HeaderBodyLayout";
import { MyCustomerCard } from "@/components/crm/CustomerCard";
import { SearchHeader } from "@/components/crm/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { ICON_MAP } from "@/constant/global";
import EmptyComponent from "@/components/EmptyComponent";

function MyCustomerPage() {
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo);
  const myCustomerData = useSelector((state: RootState) => state.crmModel.myCustomerData);
  const activeRoute = useSelector(
    (state: RootState) => state.routerModel.activeRoute,
  );
  const dispatch = useDispatch<Dispatch>();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (tableFields === undefined) {
      dispatch.crmModel.getCrmFields();
    }
    if (entityVo === undefined) {
      dispatch.crmModel.getEntityObject();
    }
    getCrmDataBySelf();
  }, [activeRoute]);
  const getCrmDataBySelf = async (pageNum?: number, pageSize?: number) => {
    await dispatch.crmModel.getEntityValues({
      mode: "mine",
      pageNum,
      pageSize
    })
  };

  // 4. 触底加载更多
  useReachBottom(() => {
    setCurrentPage((prev) => prev + 1);
  });

  return (
    <HeaderBodyLayout
      headerHeight={230}
      rootClassName="bg-active"
      bodyClassName="pb-16 mesh-gradient rounded-t-2xl pt-2"
      headerComponent={<SearchHeader mode="mine" />}
    >
      <View className="p-3 flex flex-col gap-2">
        {myCustomerData.length === 0 && (
          <EmptyComponent
            btnText="刷新"
            icon={ICON_MAP.EmptyIcon}
            onBtnClick={() => {
              getCrmDataBySelf();
            }}
          />
        )}
        {myCustomerData.map((it, idx) => (
          <MyCustomerCard
            key={idx}
            data={it}
            onClick={() => {
              dispatch.crmModel.setSelectedEntityValue(it);
              dispatch.routerModel.navigateTo({ url: ROUTERS.customerDetail });
            }}
          />
        ))}
      </View>
    </HeaderBodyLayout>
  );
}

export default withGlobalLayout(MyCustomerPage);
