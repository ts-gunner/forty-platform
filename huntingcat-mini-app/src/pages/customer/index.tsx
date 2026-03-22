import { View } from "@tarojs/components";
import "./index.scss";
import { useEffect, useState } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { ROUTERS } from "@/constant/menus";
import HeaderBodyLayout from "@/components/layout/HeaderBodyLayout";
import { MyCustomerCard } from "@/components/crm/CustomerCard";
import { SearchHeader } from "@/components/crm/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { getEntityValueListBySelf } from "@/services/steins-admin/crmEntityValueController";
import { CRM_TABLE_CODE, DEFAULT_PAGE_SIZE, ICON_MAP } from "@/constant/global";
import { handleResponse, Notify } from "@/utils/common";
import EmptyComponent from "@/components/EmptyComponent";

function MyCustomerPage() {
  const tableFields = useSelector(
    (state: RootState) => state.crmModel.tableFields,
  );
  const dispatch = useDispatch<Dispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [customerData, setCustomerData] = useState<API.CrmEntityValueVo[]>([]);
  useEffect(() => {
    if (tableFields === undefined) {
      dispatch.crmModel.getCrmFields();
    }
    getCrmDataBySelf();
  }, []);

  const getCrmDataBySelf = async (pageNum?: number, pageSize?: number) => {
    Notify.loading("数据加载中....");
    const resp = await getEntityValueListBySelf({
      pageNum: pageNum || 1,
      pageSize: pageSize || DEFAULT_PAGE_SIZE,
      entityKey: CRM_TABLE_CODE,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        if (data.entityValue.list.length === 0) {
          Notify.ok("没有更多数据了");
        } else {
          setCustomerData(data.entityValue.list);
          Notify.clear();
        }
      },
      onError: () => {
        Notify.fail("获取客户数据失败:" + resp.msg);
      },
    });
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
        {customerData.length === 0 && (
          <EmptyComponent btnText="刷新" icon={ICON_MAP.EmptyIcon} onBtnClick={() => {
            getCrmDataBySelf()
          }}/>
        )}
        {customerData.map((it, idx) => (
          <MyCustomerCard
            key={idx}
            data={it}
            onClick={() => {
              dispatch.crmModel.setSelectedEntityValue(it)
              Taro.navigateTo({ url: ROUTERS.customerDetail });
            }}
          />
        ))}
      </View>
    </HeaderBodyLayout>
  );
}

export default withGlobalLayout(MyCustomerPage);
