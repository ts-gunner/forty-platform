import { useReactFlow, ViewportPortal } from '@xyflow/react'
import { Button, ConfigProvider } from 'antd'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import constants from './constants'

export default function MeetingReport() {
    const { setCenter } = useReactFlow()
    const gotoStepTwo = () => {
        setCenter(constants.knowMe.x + 120, constants.knowMe.y + 180, {
            zoom: 1.2,
            duration: 500,
        })
    }
    return (
        <ViewportPortal>
            <ConfigProvider theme={{
                token: {
                    colorPrimary: "#247564"
                }
            }}>
                <div
                    className=''
                    style={{
                        position: "absolute",
                        left: constants.meetingReport.x,
                        top: constants.meetingReport.y,
                       pointerEvents: "none",  // 全局设置none，都可以穿透鼠标， 需要点击的时候单独加pointerEvents: "auto"
                    }}
                >
                    {/* Header */}
                    <div className='flex items-center gap-4'>
                        <span className='bg-[#247564] flex h-10 w-10 items-center justify-center text-white font-bold rounded-xl flex-shrink-0'>1</span>
                        <div className='flex flex-col'>
                            <span className='text-2xl font-bold'>会议简报</span>
                            <span className='font-[600]'>先看清这场谈判为什么发生，以及你需要带着什么进入会场。</span>
                        </div>
                    </div>

                    <main className='h-[500px] gap-4 mt-6 flex'>

                        {/* 会议信息 */}
                        <div className=' p-4 rounded-lg  border bg-white'>
                            <div className='font-bold mb-6'>会议信息</div>
                            <div className='flex flex-col gap-1'>
                                <span className='text-xs text-gray-500'>会议名称</span>
                                <span>渔业补贴与IUU规制</span>
                            </div>
                            <div className='border-t-1 my-4'></div>
                            <div className='flex flex-col gap-1'>
                                <span className='text-xs text-gray-500'>核心议题</span>
                                <span>渔业补贴与IUU规制</span>
                            </div>
                            <div className='border-t-1 my-4'></div>

                        </div>

                        <div className='flex flex-col justify-between w-[220px]'>
                            <div>
                                <div className='rounded-lg bg-white p-6 flex flex-col gap-2'>
                                    <span className='font-bold'>本轮核心争议</span>
                                    <span>各方都支持打击IUU捕捞，但
                                        对禁令边界、发展中成员过渡
                                        安排、补贴透明度和执行成本
                                        仍有明显分歧。</span>
                                </div>
                            </div>
                            <Button className='flex' type='primary' onClick={gotoStepTwo} style={{
                                pointerEvents: "auto",  // 独立控制是否穿透鼠标
                            }}>
                                <span>开始准备</span>
                                <ArrowRight className='h-4 w-4' />
                            </Button>
                        </div>

                    </main>
                </div>
            </ConfigProvider>

        </ViewportPortal>
    )
}
