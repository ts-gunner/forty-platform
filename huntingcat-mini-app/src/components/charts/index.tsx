import Taro, { nextTick, useReady } from '@tarojs/taro'
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
  lazyUpdate?: boolean
  showLoading?: boolean
  /**
   *  https://echarts.apache.org/zh/api.html#echarts.init
   */
  opts?: Opts
  isPage?: boolean
}

const Echarts: ForwardRefRenderFunction<EchartsHandle, EChartsProps> = (
  { echarts, isPage = true, canvasId: pCanvasId, ...props },
  ref,
) => {
  const canvasRef = useRef<HTMLDivElement | HTMLCanvasElement | null>(null)
  const chartRef = useRef<EChartsInstance>(undefined)
  const [isInitialResize, setIsInitialResize] = useState<boolean>(true)
  const prevProps = usePrevious<EChartsProps>(props)
  const canvasId = useMemo(() => pCanvasId || uniqueId('canvas_'), [pCanvasId])
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
    // 顶层页面级别才触发useReady 【注意Popup 、Dialog 等弹出层 都不是页面级别】
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP && isPage) {
      nextTick(() => {
        initChart()
      })
    }
  })

  useEffect(() => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB || !isPage) {
      tripleDefer(() => {
        nextTick(() => {
          initChart()
        })
      })
    }
  }, [])

  useUnMount(() => {
    dispose()
  })

  useUpdateEffect(() => {
    if (
      !isEqual(prevProps?.theme, props.theme) ||
      !isEqual(prevProps?.opts, props.opts)
    ) {
      dispose()
      initChart() // re-render
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
    const { theme, opts } = props
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
      notMerge = true, // 不跟之前设置的option合并，保证每次渲染都是最新的option
      lazyUpdate = false, // 设置完 option 后是否不立即更新图表，默认为 false，即同步立即更新。如果为 true，则会在下一个 animation frame 中，才更新图表
      showLoading,
    } = props
    // 1. 获取echarts实例
    const echartInstance = chartRef.current
    if (echartInstance) {
      echartInstance.resize()
      // 2. 设置option
      echartInstance.setOption(option, notMerge, lazyUpdate)
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
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const [result] = res
        if (result) {
          const { node, width, height } = result || {}
          const canvasNode = node
          const canvasDpr = Taro.getSystemInfoSync().pixelRatio
          const ctx = canvasNode.getContext('2d')
          const canvas = new WxCanvas(ctx, true, canvasNode)
          echarts?.setCanvasCreator(() => {
            return canvas
          })
          canvasRef.current = canvas as any
          renderEcharts({
            width,
            height,
            devicePixelRatio: canvasDpr,
          })
        }
      })
  }

  // 初始化图表
  const initChart = () => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB && canvasRef.current) {
      const width = props.style?.width || canvasRef.current?.clientWidth || window.innerWidth
      const height = props.style?.height || canvasRef.current?.clientHeight || 300
      renderEcharts({
        width,
        height,
        devicePixelRatio: window.devicePixelRatio,
      })
    } else {
      initWexinChart()
    }
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