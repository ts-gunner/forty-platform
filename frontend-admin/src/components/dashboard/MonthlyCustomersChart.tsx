import { getCustomerTrendChart } from "@/services/steins-admin/analysisController";
import { handleResponse, Notify } from "@/utils/common";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
const chartColors = ["#E91E63", "#00E676", "#FFD600", "#1DE9B6"];
export default function MonthlyCustomersChart() {
  const [seriesData, setSeriesData] = useState<ApexAxisChartSeries>([]);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "area",
      height: 350,
      locales: [{
        name: 'zh-cn',
        options: {
          months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
          shortDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          toolbar: {
            exportToSVG: '下载 SVG',
            exportToPNG: '下载 PNG',
            exportToCSV: '下载 CSV',
            selection: '选择',
            selectionZoom: '选择缩放',
            zoomIn: '放大',
            zoomOut: '缩小',
            pan: '平移',
            reset: '重置缩放',
          }
        }
      }],
      defaultLocale: 'zh-cn',
      fontFamily: "Outfit, sans-serif",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    colors: chartColors,
    stroke: {
      curve: "smooth",
    },
   tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: "yyyy-MM-dd",
      },
     
    },
    
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        // ApexCharts 会根据缩放自动切换以下格式
        datetimeFormatter: {
          year: "yyyy",
          month: "yyyy MMM",
          day: "MMM dd",
          hour: "HH:mm",
        },
      },
    },
    fill: {
      type: "gradient", // 渐变模式（改成 'solid' 就是纯色）
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 1, // 顶部透明度
        opacityTo: 1, // 底部透明度
        stops: [0, 100],
      },
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
              x: it.statDate,
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
