import { getCustomerTrendChart } from "@/services/steins-admin/analysisController";
import { handleResponse, Notify } from "@/utils/common";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

export default function MonthlyCustomersChart() {
  const [seriesData, setSeriesData] = useState<ApexAxisChartSeries>([]);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "area",
      height: 350,
      fontFamily: "Outfit, sans-serif",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "straight",
      colors: ["#da4f7a", "#eb604c"],
    },
    tooltip: {
     
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient", // 渐变模式（改成 'solid' 就是纯色）
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 1, // 顶部透明度
        opacityTo: 1, // 底部透明度
        stops: [0, 100],
      },
      colors: ["#da4f7a"], // 填充主色（和线条保持一致更美观）
    },
    yaxis: {
      // opposite: true,  // 纵坐标位置， true: 右侧 false: 在左侧
    },
    legend: {
      horizontalAlign: "left",
    },
  });

   useEffect(() => {
      getData();
    }, []);
  
    const getData = async () => {
      const resp = await getCustomerTrendChart();
      handleResponse({
        resp,
        onSuccess: (data) => {
          setSeriesData([
          {
            name: "当前总数",
            data: (data || []).map(it => ({
              x: dayjs(it.statDate).format("MM-DD"),
              y: it.totalCount,
            }))
          }
        ])
        },
        onError: () => Notify.fail(resp.msg || "获取数据失败"),
      });
    };
  
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">客户每日总量趋势</h3>
      </div>

      <div className="w-full">
        <Chart options={options} series={seriesData} type="area" height={350} />
      </div>
    </div>
  );
}
