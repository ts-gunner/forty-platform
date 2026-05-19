import { useEffect, useRef, useState } from "react";
import { View, Canvas } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { getCustomerTrendChart } from "@/services/steins-admin/analysisController";
import { handleResponse } from "@/utils/common";
import Echarts from "@/components/charts";
import echarts from "@/assets/echarts.js";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { EChartsOption } from "echarts";
import { EchartsHandle } from "@/components/charts/types";

function AnalysisPage() {
  const [chartData, setChartData] = useState<API.CustomerTrendChart[]>([]);
  const [chartLoading,setChartLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<EChartsOption>({
    legend: {
      top: 50,
      left: "center",
      z: 100,
    },
    tooltip: {
      trigger: "axis",
      show: true,
      confine: true,
    },
    xAxis: {
      type: "category",
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data:[150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  });
  const echartsRef = useRef<EchartsHandle>(null);
  const retryCount = useRef(0);
  useDidShow(() => {
    getChartData();
  });
  useEffect(() => {
    if (chartData.length === 0) return;

    // 重置重试计数器（防止多次触发时叠加）
    retryCount.current = 0;

    Taro.nextTick(() => {
      setOptions({
        legend: {
          top: 50,
          left: "center",
          z: 100,
        },
        tooltip: {
          trigger: "axis",
          show: true,
          confine: true,
        },
        xAxis: {
          type: "category",
          data: chartData.map(it => it.statDate),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: chartData.map(it => it.totalCount),
            type: "line",
          },
        ],
      });
    });
  }, [chartData]);
  const getChartData = async () => {
    setChartLoading(true)
    const resp = await getCustomerTrendChart();
    handleResponse({
      resp,
      onSuccess: (data) => {
        setChartData(data || []);
      },
      onFinish: ()=> {
        setChartLoading(false)
      }
    });
  };
  return (
    <HeaderBodyFooterLayout title="">
      <View style={{ width: "100%", height: "600rpx" }}>
        <Echarts
          echarts={echarts}
          option={options}
          ref={echartsRef}
          showLoading={chartLoading}
          lazyUpdate
          // isPage={false}
          // style自定义设置echarts宽高
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(AnalysisPage);
