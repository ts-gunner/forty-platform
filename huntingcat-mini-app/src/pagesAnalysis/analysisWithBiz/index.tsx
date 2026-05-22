import { useEffect, useMemo, useRef, useState } from "react";
import { Picker, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";
import { getCustomerTrendChart, getCustomerTrendChartByUserId } from "@/services/steins-admin/analysisController";
import { handleResponse, Notify } from "@/utils/common";
import Echarts from "@/components/charts";
import echarts from "@/assets/echarts.js";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { EChartsOption } from "echarts";
import { formatDateTime } from "@/utils/time";
import { getUserListByRoleKey } from "@/services/steins-admin/systemUserController";
import { CRM_ROLE_NAME } from "@/constant/global";

function AnalysisWithBizPage() {
  const [chartData, setChartData] = useState<API.CustomerTrendChart[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false)
  const [businessUserList, setBusinessUserList] = useState<API.UserVo[]>([]);
  const [activeBizName, setActiveBizName] = useState<string>("")
  const getBusinessWorkerOptions = async () => {
    console.log("获取业务员信息");
    const resp = await getUserListByRoleKey({
      roleKey: CRM_ROLE_NAME,
      pageSize: 9999,
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setBusinessUserList(data.list || []);
      },
    });
  };
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
  useDidShow(() => {
    getBusinessWorkerOptions();
  });

  const getChartData = async (userId: string) => {
    setChartLoading(true)
    const resp = await getCustomerTrendChartByUserId({
      userId
    });
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
    <HeaderBodyFooterLayout title="业务员拓客">
      <View className="p-3">
        <View className="flex items-center">
          <Picker
            onChange={async (e: any) => {
              const idx = Number.parseInt(e.detail.value);
              let user = businessUserList[idx];
              setActiveBizName(user.nickName)
              await getChartData(user.userId)
            }}
            rangeKey="nickName"
            range={businessUserList}
            
          >
            <View className="py-3 bg-white border border-gray-200 rounded-full text-center text-sm font-bold text-gray-600 active:bg-gray-100 px-4">
              {activeBizName || "选择业务员"}
            </View>
          </Picker>
        </View>
        {

          chartData.length === 0 && (
            <View className="flex items-center justify-center">
              暂无数据
            </View>
          )
        }
        <View style={{ width: "100%", height: "600rpx" }}>
          <Echarts
            echarts={echarts}
            option={chartOptions}
            style={{ width: "100%", height: "100%" }}
            showLoading={chartLoading}
          />
        </View>
      </View>

    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(AnalysisWithBizPage);
