import { ApexOptions } from "apexcharts";
import { useState } from "react";
import Chart from "react-apexcharts";

export default function MonthlyCustomersChart() {
  const [seriesData, setSeriesData] = useState<ApexAxisChartSeries>([
    {
      name: "当前总数",
      data: [
        { x: "13 Nov 2017", y: 8107.85 },
        { x: "14 Nov 2017", y: 8128 },
        { x: "15 Nov 2017", y: 8122.9 },
        { x: "16 Nov 2017", y: 8165.5 },
        { x: "17 Nov 2017", y: 8340.7 },
        { x: "20 Nov 2017", y: 8423.7 },
        { x: "21 Nov 2017", y: 8423.5 },
        { x: "22 Nov 2017", y: 8514.3 },
        { x: "23 Nov 2017", y: 8481.85 },
        { x: "24 Nov 2017", y: 8487.7 },
        { x: "27 Nov 2017", y: 8506.9 },
        { x: "28 Nov 2017", y: 8626.2 },
        { x: "29 Nov 2017", y: 8668.95 },
        { x: "30 Nov 2017", y: 8602.3 },
        { x: "01 Dec 2017", y: 8607.55 },
        { x: "04 Dec 2017", y: 8512.9 },
        { x: "05 Dec 2017", y: 8496.25 },
        { x: "06 Dec 2017", y: 8600.65 },
        { x: "07 Dec 2017", y: 8881.1 },
        { x: "08 Dec 2017", y: 9340.85 },
      ],
    },
  ]);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "area",
      height: 350,
      fontFamily: "Outfit, sans-serif",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: "straight",
      colors: ["#da4f7a", "#eb604c"]
    },
    tooltip: {
      
    },
    dataLabels: {
      enabled: false
    },
    fill: {
    type: "gradient", // 渐变模式（改成 'solid' 就是纯色）
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 1,  // 顶部透明度
      opacityTo: 1,   // 底部透明度
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
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">客户数据量</h3>
      </div>

      <div className="w-full">
        <Chart options={options} series={seriesData} type="area" height={350} />
      </div>
    </div>
  );
}
