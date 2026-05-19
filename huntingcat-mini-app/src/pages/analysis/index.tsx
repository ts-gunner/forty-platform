import { withGlobalLayout } from "@/components/AppLayout";
import { getCustomerTrendChart } from "@/services/steins-admin/analysisController";
import { handleResponse } from "@/utils/common";
import { useState } from "react";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { View } from "@tarojs/components";
import { useDidHide, useDidShow } from "@tarojs/taro";
function AnalysisWithBizPage() {
  const [chartData, setChartData] = useState<API.CustomerTrendChart[]>([]);
 
  useDidShow(() => {
    getPageData();
  });
  useDidHide(() => {});
  const getPageData = async () => {
    const resp = await getCustomerTrendChart();
    handleResponse({
      resp,
      onSuccess: (data) => {
        setChartData(data || []);
      },
    });
  };

  return (
    <HeaderBodyFooterLayout title="客源增量">
      <View style={{ width: "100%", height: "600rpx", position: "relative" }}>
        暂未实现
      </View>
    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(AnalysisWithBizPage);
