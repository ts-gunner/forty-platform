import { View } from "@tarojs/components";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { ROUTERS } from "@/constant/menus";
import HeaderBodyLayout from "@/components/layout/HeaderBodyLayout";
import { CustomerCard } from "@/components/crm/CustomerCard";
import { SearchHeader } from "@/components/crm/SearchBox";
import { getEntityValueList } from "@/services/steins-admin/crmEntityValueController";
import { handleResponse, Notify } from "@/utils/common";
import { CRM_TABLE_CODE, DEFAULT_PAGE_SIZE } from "@/constant/global";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";

function AllCustomerPage() {
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const entityVo = useSelector((state: RootState) => state.crmModel.entityVo);
  const allCustomerData = useSelector((state: RootState) => state.crmModel.allCustomerData);
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
    getAllCrmData();
  }, [activeRoute]);
  // 4. 触底加载更多
  useReachBottom(() => {
    console.log("触碰底部");
    setCurrentPage((prev) => prev + 1);
  });
  const getAllCrmData = async (pageNum?: number, pageSize?: number) => {
    await dispatch.crmModel.getEntityValues({
      mode: "all",
      pageNum,
      pageSize
    })
  };
  return (
    <HeaderBodyLayout
      headerHeight={230}
      rootClassName="bg-active"
      bodyClassName="pb-16 mesh-gradient rounded-t-2xl pt-2"
      headerComponent={<SearchHeader mode="all" />}
    >
      <View className="p-3 flex flex-col gap-2">
        {allCustomerData.map((it, idx) => (
          <CustomerCard
            mode="all"
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

export default withGlobalLayout(AllCustomerPage);
