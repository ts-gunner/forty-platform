import { CanvasProps } from '@tarojs/components/types/Canvas'
import { EChartsOption, ECharts } from 'echarts'
import { CSSProperties, RefObject } from 'react'
export type { EChartsOption, ECharts as EChartsInstance } from 'echarts'

export type Opts = {
  devicePixelRatio?: number | undefined
  renderer?: string | undefined
  width?: number | string | undefined
  height?: number | string | undefined
}

export type EChartsProps = CanvasProps & {
  echarts: any
  className?: string
  style?: CSSProperties
  option: EChartsOption
  theme?: string | Record<string, any>
  notMerge?: boolean
  lazyUpdate?: boolean
  showLoading?: boolean
  /**
   *  https://echarts.apache.org/zh/api.html#echarts.init
   */
  opts?: Opts
  onChartReady?: (instance: ECharts) => void
  onEvents?: Record<string, (...args: any[]) => void>
  isPage?: boolean
}

export type InitEchart = {
  devicePixelRatio: number | undefined
  width: number | string | undefined
  height: number | string | undefined
}

export type EchartsHandle = {
  canvasRef: Partial<RefObject<HTMLDivElement | HTMLCanvasElement | null>>
  chartRef: Partial<RefObject<ECharts>>
}
