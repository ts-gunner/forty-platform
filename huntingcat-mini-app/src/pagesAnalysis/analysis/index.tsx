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
  const [options, setOptions] = useState<EChartsOption>({});
  // useEffect(() => {
  //   if (chartData.length === 0) return
  //   const newOptions: EChartsOption = {
  //     // 全局调色盘：使用高级轻奢的主题色
  //     color: ['#aa3226'],

  //     // 优化移动端网格边距，防止 X 轴文本或左右两侧节点被画布切掉
  //     grid: {
  //       top: '18%',
  //       left: '4%',
  //       right: '6%',
  //       bottom: '10%',
  //       containLabel: true // 确保坐标轴标签自适应包裹
  //     },

  //     tooltip: {
  //       trigger: "axis",
  //       show: true,
  //       confine: true,
  //       backgroundColor: 'rgba(255, 255, 255, 0.96)', // 纯白高质感背景
  //       borderRadius: 8,
  //       padding: [10, 14],
  //       textStyle: {
  //         color: '#1E293B',
  //         fontSize: 12,
  //       },
  //       extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);', // 加淡淡的阴影
      
  //     },

  //     xAxis: {
  //       type: "category",
  //       data: chartData.map(it => formatDateTime(it.statDate, "MM月DD日")),
  //       axisLine: {
  //         lineStyle: {
  //           color: '#E2E8F0' // 淡色 X 轴线
  //         }
  //       },
  //       axisTick: {
  //         show: false // 隐藏刻度小标记，界面更干净
  //       },
  //       axisLabel: {
  //         color: '#64748B', // 现代感的深灰文本
  //         fontSize: 11,
  //         margin: 12
  //       }
  //     },

  //     yAxis: {
  //       type: "value",
  //       splitLine: {
  //         lineStyle: {
  //           color: '#F1F5F9', // 极淡的横向网格线
  //           type: 'dashed' // 虚线网格更显精致
  //         }
  //       },
  //       axisLabel: {
  //         color: '#64748B',
  //         fontSize: 11
  //       }
  //     },

  //     series: [
  //       {
  //         name: '客源数量',
  //         data: chartData.map(it => it.totalCount),
  //         type: "line",
  //         smooth: true, // 开启平滑曲线 🌟
  //         showSymbol: true, // 始终显示拐点
  //         symbol: 'circle', // 拐点形状为实心圆
  //         symbolSize: 6, // 拐点大小

  //         // 线条本身的样式
  //         lineStyle: {
  //           width: 3, // 加粗线条
  //           shadowColor: 'rgba(79, 70, 229, 0.2)', // 线下微发光阴影
  //           shadowBlur: 8,
  //           shadowOffsetY: 4
  //         },

  //         // 拐点高亮（Hover/Touch时）
  //         itemStyle: {
  //           borderWidth: 2,
  //           borderColor: '#fff' // 白色外圈包裹，让单点更突出
  //         },

  //         areaStyle: {
  //           color: {
  //             type: 'linear',
  //             x: 0,
  //             y: 0,
  //             x2: 0,
  //             y2: 1,
  //             colorStops: [
  //               { offset: 0, color: 'rgba(231, 42, 67, 0.25)' }, // 顶部半透明紫色
  //               { offset: 1, color: 'rgba(79, 70, 229, 0.00)' }  // 底部完全透明
  //             ]
  //           }
  //         }
  //       },
  //     ],
  //   };
  //   Taro.nextTick(() => {
  //     const echartInstance = echartsRef.current?.chartRef?.current;
  //     if (echartInstance) {
  //       echartInstance.setOption(newOptions);
  //     } else {
  //       setOptions(newOptions);
  //     }
  //   });
  // }, [chartData])
  const chartOptions = useMemo<EChartsOption>(() => {
    // 💡 关键改动：如果数据还没回来，返回一个带坐标轴的空框架，或者不配 series
    // 这样 ECharts 会渲染出基础的 XY 轴线条，配合 Loading 动画极其丝滑，不会报错
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
  console.log("analysis, chartOptions",chartOptions)
  // const echartsRef = useRef<EchartsHandle>(null);
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
        />
      </View>
    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(AnalysisPage);
