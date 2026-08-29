import { Maximize, Plus } from 'lucide-react';
import React from 'react'
import { useWhiteBoard } from '../context';
import { useReactFlow } from '@xyflow/react';
import {nanoid} from "nanoid"
/**
 * 右上角的工具栏
 */
export default function BoardToolkit() {
    const { setNodes } = useWhiteBoard()
    const { screenToFlowPosition } = useReactFlow();
    const handleCreateNode = () => {
        const randomOffset = () => Math.random() * 200 - 100
        const position = screenToFlowPosition({
            x: window.innerWidth / 2 + randomOffset(),
            y: window.innerHeight / 2 + randomOffset(),
        });
        setNodes((prev) => [
            ...prev,
            { id: nanoid(), type: "noteCard", position:position, data: {} }
        ]);

    }
    return (

        <div className='flex items-center gap-4'>
            <CustomButton label='添加笔记' icon={<Plus className='h-3 w-3' />} onClick={handleCreateNode}></CustomButton>
            <CustomButton label='添加材料' icon={<Plus className='h-3 w-3' />}></CustomButton>
            <CustomButton label='全屏白板' icon={<Maximize className='h-3 w-3' />}></CustomButton>
        </div>

    )
}

const CustomButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => {

    return (
        <button
            onClick={onClick}
            className='flex items-center gap-1 text-[#247564] font-bold text-xs cursor-pointer shadow bg-[#fffffcf0] rounded-lg border border-[#4F8F83] border-opacity-30 py-2 px-3 hover:bg-[#e2f0ec]'>
            {icon}
            <span>{label}</span>

        </button>
    )
}