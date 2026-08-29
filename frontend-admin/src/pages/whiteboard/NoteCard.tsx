import { Handle, NodeResizer, Position } from '@xyflow/react'
import { Input } from 'antd'
import { Plus } from 'lucide-react'
import React, { useRef, useState } from 'react'

export default function NoteCard() {
    const [isHover, setIsHover] = useState<boolean>(false)
    const timeoutRef = useRef<number | null>(null)
    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setIsHover(true)
    }

    const handleMouseLeave = () => {

        timeoutRef.current = setTimeout(() => {
            setIsHover(false)
        }, 300) as unknown as number// 延迟 300ms 隐藏
    }

    return (
        <>
            {/* 可以调节node大小 */}
            <div className='bg-[#fff3cf] border-[#e3cda7] border rounded-lg p-4 min-w-[340px] min-h-[240px]'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* <NodeResizer minWidth={340} minHeight={240} isVisible={isHover}
                    lineClassName="border-[#247564]/40 border-2 border-dashed transition-all duration-200"
                    handleClassName={`
                        bg-[#247564] w-3 h-3 rounded-full border-2 border-white shadow-md
                        transition-opacity duration-200
                        ${isHover ? 'opacity-100' : 'opacity-0'}
                    `}
                /> */}

                <main >
                    <div className='flex justify-between w-full items-center'>
                        <div className='text-sm text-[#3b3500] py-2 px-3 bg-[#f0debc] rounded-lg'>我的便签</div>
                        <div className='flex items-center gap-3'>
                            <Plus className='h-4 w-4 text-[#3b3500] font-bold' />
                            <div className='border bg-white/40 text-[#247564] text-xs py-2 px-3 rounded-lg'>用于策略</div>
                        </div>
                    </div>
                    <textarea  className='h-full w-full mt-3 outline-none' rows={7}/>
                </main>


            </div>
            <Handle type="source" position={Position.Left} />
            <Handle type="target" position={Position.Right} />

        </>
    )
}
