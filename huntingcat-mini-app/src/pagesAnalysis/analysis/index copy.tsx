import {  useMemo, useRef, useState } from "react";
import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { getCustomerTrendChart } from "@/services/steins-admin/analysisController";
import { handleResponse } from "@/utils/common";
import Echarts from "@/components/charts";
import echarts from "@/assets/echarts.js";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { EChartsOption } from "echarts";
import { EchartsHandle } from "@/components/charts/types";
import { formatDateTime } from "@/utils/time";

function AnalysisPage() {
  const [chartData, setChartData] = useState<API.CustomerTrendChart[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false)
  const echartsRef = useRef<EchartsHandle>(null);
  useDidShow(() => {
    getChartData();
  });
  const options = useMemo<EChartsOption>(() => {
    return {
      legend: { top: 50, left: "center", z: 100 },
      tooltip: { trigger: "axis", show: true, confine: true },
      xAxis: {
        type: "category",
        // 如果没数据，传空数组；有数据，传格式化后的数组
        data: chartData.length ? chartData.map(it => formatDateTime(it.statDate, "MMM dd")) : [],
      },
      yAxis: { type: "value" },
      series: [
        {
          data: chartData.length ? chartData.map(it => it.totalCount) : [],
          type: "line",
        },
      ],
    };
  }, [chartData]);
  const getChartData = async () => {
    setChartLoading(true)
    const resp = await getCustomerTrendChart();
    handleResponse({
      resp,
      onSuccess: (data) => {
        setChartData(data || []);
      },
      onFinish: () => {
        setChartLoading(false)
      }
    });
  };
  return (
    <HeaderBodyFooterLayout title="客源增量">
      <View style={{ width: "100%", height: "600rpx" }}>
        <Echarts
          echarts={echarts}
          option={options}
          ref={echartsRef}
          // isPage={false}
          // style自定义设置echarts宽高
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(AnalysisPage);
