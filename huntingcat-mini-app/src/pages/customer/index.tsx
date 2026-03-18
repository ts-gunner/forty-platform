import { View } from "@tarojs/components";
import "./index.scss";
import { MockData } from "@/typing";
import {  CUSTOMER_INFO_LIST} from "@/constant/mock";
import { useEffect, useState } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { ROUTERS } from "@/constant/menus";
import HeaderBodyLayout from "@/components/layout/HeaderBodyLayout";
import { MyCustomerCard } from "@/components/crm/CustomerCard";
import { SearchHeader } from "@/components/crm/SearchBox";


function MyCustomerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<MockData.CustomerDataType[]>([]);
  useEffect(() => {
    refresh();
  }, []);

  const refresh = async (pageNumber: number = 1) => {
    setDataLoading(true);
    setCustomerData(CUSTOMER_INFO_LIST);
    setDataLoading(false);
    return CUSTOMER_INFO_LIST;
  };


  // 4. 触底加载更多
  useReachBottom(() => {
    console.log("触碰底部");
    setCurrentPage((prev) => prev + 1);
  });

  return (
    <HeaderBodyLayout
      headerHeight={230}
      rootClassName="bg-active"
      bodyClassName="pb-16 mesh-gradient rounded-t-2xl pt-2"
      headerComponent={(
        <SearchHeader mode="mine"/>
      )}
    >
      <View
        className="p-3 flex flex-col gap-2"
      >
        {customerData.map((it, idx) => (
          <MyCustomerCard key={idx} data={it} onClick={() => {

            Taro.navigateTo({ url: ROUTERS.customerDetail });
          }} />
        ))}

      </View>

    </HeaderBodyLayout>

  );
}






export default withGlobalLayout(MyCustomerPage);
