import Taro, { nextTick, useDidShow, useReady } from '@tarojs/taro'
import { Canvas, View } from '@tarojs/components'
import {
  useRef,
  useState,
  useMemo,
  memo,
  useEffect,
  CSSProperties,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { isString, isFunction, isEqual, pick, uniqueId, compareVersion, tripleDefer } from './utils'
import WxCanvas from './weapp/wx-canvas'
import { touchEnd, touchMove, touchStart } from './weapp/wx-touch'
import { usePrevious, useUnMount, useUpdateEffect } from './hooks'
import { EChartsOption, ECharts } from 'echarts'
import { InitEchart, EChartsInstance, EchartsHandle } from './types'
export type { EChartsOption, ECharts as EChartsInstance } from 'echarts'
import { CanvasProps } from '@tarojs/components/types/Canvas'
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
  showLoading?: boolean
  /**
   *  https://echarts.apache.org/zh/api.html#echarts.init
   */
  opts?: Opts
}

const Echarts: ForwardRefRenderFunction<EchartsHandle, EChartsProps> = (
  { echarts, canvasId: pCanvasId, ...props },
  ref,
) => {
  const canvasRef = useRef<HTMLDivElement | HTMLCanvasElement | null>(null)
  const chartRef = useRef<EChartsInstance>(undefined)
  const [isInitialResize, setIsInitialResize] = useState<boolean>(true)
  const prevProps = usePrevious<EChartsProps>(props)
  const canvasId = useMemo(() => pCanvasId || uniqueId('canvas_'), [pCanvasId])
  const propsRef = useRef<any>(props)
  useEffect(() => {
    propsRef.current = props
  }, [props])
  const retryCountRef = useRef<number>(0)
  const canvasProps = useMemo(
    () => [
      'disableScroll',
      'disableScroll',
      'onTouchCancel',
      'onLongTap',
      'onError',
      'nativeProps',
      'className',
      'key',
      'hidden',
      'animation',
    ],
    [],
  )
  const canvasStyle = useMemo(
    () =>
    ({
      width: '100%',
      height: '300px',
      ...(props.style as CSSProperties),
    } as CSSProperties),
    [props.style],
  )
  /**
   * issues: https://github.com/NervJS/taro/issues/7116
   * 获取小程序渲染层的节点要在 onReady 生命周期，等同于 useReady hooks
   * 访问小程序渲染层的 DOM 节点。
   */
  useReady(() => {
    nextTick(() => {
      initWexinChart()
    })
  })

  useUnMount(() => {
    dispose()
  })

  useUpdateEffect(() => {
    if (
      !isEqual(prevProps?.theme, props.theme) ||
      !isEqual(prevProps?.opts, props.opts)
    ) {
      dispose()
      initWexinChart() // re-render
      return
    }

    // update
    const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption']
    if (!isEqual(pick(props, pickKeys), pick(prevProps, pickKeys))) {
      nextTick(() => {
        updateEChartsOption()
      })
    }

    /**
     * resize: style 、className
     */
    if (
      !isEqual(prevProps?.style, props.style) ||
      !isEqual(prevProps?.className, props.className)
    ) {
      resize(canvasRef.current)
    }
  }, [props])

  // 大小变化
  const resize = (canvas) => {
    const echartsInstance = echarts.getInstanceByDom(canvas)
    // 调整大小不应在第一次渲染时发生，因为它会取消初始 echarts 动画
    if (!isInitialResize) {
      try {
        echartsInstance.resize({
          width: 'auto',
          height: 'auto',
        })
      } catch (e) {
        console.warn(e)
      }
    }
    setIsInitialResize(false)
  }

  const initEchartsInstance = async ({ width, height, devicePixelRatio }: InitEchart) => {
    const { theme, opts } = propsRef.current
    return new Promise((resolve, reject) => {
      if (canvasRef.current) {
        chartRef.current = echarts.init(canvasRef.current, theme, {
          width,
          height,
          devicePixelRatio,
          ...opts,
        })
        resolve(chartRef.current)
      } else {
        reject(null)
      }
    })
  }

  const updateEChartsOption = () => {
    /**
     *  官方文档：https://echarts.apache.org/zh/api.html#echartsInstance.setOption
     */
  const {
      option,
      notMerge = true,
      showLoading,
    } = propsRef.current

    // 1. 获取echarts实例
    const echartInstance = chartRef.current
    if (echartInstance) {
      echartInstance.resize()
      // 2. 设置option
      echartInstance.setOption(option|| {}, notMerge)
      // 3. 显示加载动画效果
      if (showLoading) {
        echartInstance.showLoading()
      } else {
        echartInstance.hideLoading()
      }
    }

    return echartInstance
  }

  // 渲染图表
  const renderEcharts = async ({ width, height, devicePixelRatio }: InitEchart) => {
    // 1. 初始化图表
    await initEchartsInstance({
      width,
      height,
      devicePixelRatio,
    })
    // 2. 更新echarts实例
    updateEChartsOption()

    // 5. resize
    if (canvasRef.current) {
      resize(canvasRef.current)
    }
  }

  // 销毁echarts实例
  const dispose = () => {
    if (chartRef.current) {
      echarts?.dispose(chartRef.current)
    }
  }

  // 初始化微信小程序图表
 const initWexinChart = () => {
    const query = Taro.createSelectorQuery()
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {

        const [result] = res
        // 确保不仅 result 存在，result.node 小程序原生节点也必须存在
        if (result && result.node) {
          retryCountRef.current = 0 // 成功后重置计数器
          const { node, width, height } = result
          const canvasNode = node
          const canvasDpr = Taro.getSystemInfoSync().pixelRatio
          const ctx = canvasNode.getContext('2d')
          const canvas = new WxCanvas(ctx, true, canvasNode)
          
          echarts?.setCanvasCreator(() => canvas)
          canvasRef.current = canvas as any
          
          renderEcharts({
            width,
            height,
            devicePixelRatio: canvasDpr,
          })
        } else {
          // 没拿到节点，进行安全重试
          if (retryCountRef.current < 5) {
            retryCountRef.current++
            console.warn(`[Echarts] 找不到节点或 node 为空，正在进行第 ${retryCountRef.current} 次重试...`)
            setTimeout(() => {
              initWexinChart()
            }, 100)
          } else {
            console.error(`[Echarts] 连续重试失败，请检查 Dom 节点或 canvasId: ${canvasId}`)
            retryCountRef.current = 0
          }
        }
      })
  }

  useImperativeHandle(ref, () => ({ chartRef, canvasRef }))

  return (
    <Canvas
      type='2d'
      id={canvasId}
      canvasId={canvasId}
      style={canvasStyle}
      ref={canvasRef}
      onTouchStart={(event) => touchStart({ chart: chartRef.current, event })}
      onTouchMove={(event) => touchMove({ chart: chartRef.current, event })}
      onTouchEnd={(event) => touchEnd({ chart: chartRef.current, event })}
      {...pick(props, canvasProps)}
    />
  )
}

export default memo(forwardRef(Echarts))