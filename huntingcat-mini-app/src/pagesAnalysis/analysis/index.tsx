import { useEffect, useMemo, useRef, useState } from "react";
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
import { formatDateTime } from "@/utils/time";

function AnalysisPage() {
  const [chartData, setChartData] = useState<API.CustomerTrendChart[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false)

  const chartOptions = useMemo<EChartsOption>(() => {
    const hasData = chartData && chartData.length > 0;
    return {
      color: ['#aa3226'],
      grid: {
        top: '18%',
        left: '4%',
        right: '6%',
        bottom: '10%',
      },
      tooltip: {
        trigger: "axis",
        show: hasData, // 没数据时不响应
        confine: true,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderRadius: 8,
        padding: [10, 14],
        textStyle: { color: '#1E293B', fontSize: 12 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);',
      },
      xAxis: {
        type: "category",
        // 没数据时给个空的占位，防止 ECharts 内部报 width/length 错误
        data: hasData ? chartData.map(it => formatDateTime(it.statDate, "MM月DD日")) : [],
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748B', fontSize: 11, margin: 12 }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
        axisLabel: { color: '#64748B', fontSize: 11 }
      },
      series: hasData ? [
        {
          name: '客源数量',
          data: chartData.map(it => it.totalCount),
          type: "line",
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(79, 70, 229, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 4
          },
          itemStyle: { borderWidth: 2, borderColor: '#fff' },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(231, 42, 67, 0.25)' },
                { offset: 1, color: 'rgba(79, 70, 229, 0.00)' }
              ]
            }
          }
        },
      ] : [], // 没数据时传入空数组
    };
  }, [chartData]);
  useDidShow(() => {
    getChartData();
  });

  const getChartData = async () => {
    setChartLoading(true)
    const resp = await getCustomerTrendChart();
    handleResponse({
      resp,
      onSuccess: (data) => {
        setChartData(data || [])

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
          option={chartOptions}
          style={{ width: "100%", height: "100%" }}
          showLoading={chartLoading}
        />
      </View>
    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(AnalysisPage);
