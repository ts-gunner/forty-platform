import { useEffect, useRef } from "react";
import { View, Canvas } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { withGlobalLayout } from "@/components/AppLayout";

function AnalysisPage() {
  // 模拟的图表数据
  const chartData = [120, 203, 145, 650, 300, 450];
  const labels = ["周一", "周二", "周三", "周四", "周五", "周六"];
  const retryCount = useRef(0);
  useEffect(() => {
    // 必须在页面渲染完成后，延迟一小会儿获取 Canvas 节点
    Taro.nextTick(() => {
      drawChart();
    });
  }, []);

  const drawChart = () => {
    // 1. 创建选择器查询 Canvas 节点
    const query = Taro.createSelectorQuery();
    query
      .select("#myCanvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          if (retryCount.current < 5) {
            retryCount.current++;
            console.warn(
              `[Canvas] 第 ${retryCount.current}次获取节点失败，正在重试...`,
            );
            // 没拿到节点时，延迟 200ms 再次尝试，直到拿到为止
            setTimeout(drawChart, 200);
          } else {
            console.error(
              "[Canvas] 超过最大重试次数，未能成功获取 Canvas 节点，请检查基础库版本或节点配置",
            );
          }
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");

        // 2. 处理高分屏模糊问题 (DPR 适配)
        const dpr = Taro.getSystemInfoSync().pixelRatio;
        const width = res[0].width;
        const height = res[0].height;

        // 设置 Canvas 画布的实际像素大小
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        // 缩放上下文，这样后续所有绘制 API 依然可以按照正常逻辑的 width/height 来写
        ctx.scale(dpr, dpr);

        // 3. 开始绘制图表
        renderLineChart(ctx, width, height, chartData, labels);
      });
  };

  // 具体的绘制逻辑
  const renderLineChart = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: number[],
    labels: string[],
  ) => {
    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 定义图表边距
    const padding = { top: 40, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // 计算数据最大值（用于纵坐标等比缩放）
    const maxVal = Math.max(...data) * 1.2; // 留出 20% 顶部空间

    // --- 1. 绘制坐标轴线 ---
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    // Y 轴
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    // X 轴
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // --- 2. 绘制 X 轴文字与刻度 ---
    const xStep = chartWidth / (data.length - 1);
    ctx.fillStyle = "#666666";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";

    const points: { x: number; y: number }[] = [];

    data.forEach((val, index) => {
      // 计算每个点的 X, Y 坐标
      const x = padding.left + index * xStep;
      // Canvas 坐标系 Y 轴向下，所以需要用总高度去减
      const y = height - padding.bottom - (val / maxVal) * chartHeight;
      points.push({ x, y });

      // 画 X 轴标签文字
      ctx.fillText(labels[index], x, height - padding.bottom + 20);
    });

    // --- 3. 绘制折线 ---
    ctx.beginPath();
    ctx.strokeStyle = "#1890ff"; // 折线颜色
    ctx.lineWidth = 2;
    ctx.lineJoin = "round"; // 让折线拐角更圆润

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // --- 4. 绘制数据点（圆圈） ---
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff"; // 内填充白色
      ctx.fill();
      ctx.strokeStyle = "#1890ff"; // 外边框蓝色
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  return (
    <View style={{ padding: "16px" }}>
      {/* 必须指定 type="2d"，并且通过 style 控制其展示的宽高 */}
      <Canvas
        type="2d"
        id="myCanvas"
        style={{ width: "100%", height: "300px", backgroundColor: "#fff" }}
      />
    </View>
  );
}

export default AnalysisPage;
