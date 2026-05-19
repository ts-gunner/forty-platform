import { ECharts } from 'echarts'
import { RefObject } from 'react'
export type { EChartsOption, ECharts as EChartsInstance } from 'echarts'




export type InitEchart = {
  devicePixelRatio: number | undefined
  width: number | string | undefined
  height: number | string | undefined
}

export type EchartsHandle = {
  canvasRef: Partial<RefObject<HTMLDivElement | HTMLCanvasElement | null>>
  chartRef: Partial<RefObject<ECharts>>
}
