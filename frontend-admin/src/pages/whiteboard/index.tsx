import { useState, useCallback } from 'react';
import { ReactFlow, Background, BackgroundVariant, applyNodeChanges, applyEdgeChanges, addEdge, Controls, MiniMap, useViewport, ViewportPortal, Panel } from '@xyflow/react';
import type { Edge, Node } from "@xyflow/react"
import '@xyflow/react/dist/style.css';
import NoteCard from './NoteCard';
import BoardToolkit from './components/BoardToolkit';
import InfoOverview from './components/InfoOverview';
import MeetingReport from './viewports/MeetingReport';
import { useWhiteBoard, WhiteBoardProvider } from './context';
import KnowMe from './viewports/KnowMe';

const initialNodes = [
    { id: 'n1', type: "input", position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n3', type: "noteCard", position: { x: 0, y: 50 }, data: { label: 'Node 1' } },
    { id: 'n2', type: "output", position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
// https://reactflow.dev/api-reference/components/base-edge  连接线文档
const initialEdges = [{
    id: 'n1-n2', source: 'n1', target: 'n2', labelShowBg: false,
    label: 'connects with',
}];

const nodeTypes = {
    noteCard: NoteCard,  // 便利贴
}
// 在小地图上，不同node的颜色
function nodeColor(node: Node) {
    switch (node.type) {
        case 'input':
            return '#6ede87';
        case 'output':
            return '#6865A5';
        default:
            return '#ff0072';
    }
}
export default function WhiteBoardPage() {

    return (
        <WhiteBoardProvider>
            <WhiteBoardCmp />
        </WhiteBoardProvider>

    );
}

const WhiteBoardCmp = () => {
    const {nodes, setEdges, setNodes, edges} = useWhiteBoard()
    const onNodesChange = useCallback((changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
    const onEdgesChange = useCallback((changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
    const onConnect = useCallback((params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

    return (
        <div className='h-[90vh] w-full'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                proOptions={{ hideAttribution: true }}   // 去除右下角水印
                // fitView  // 画布自动缩放和平移
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            >
                {/* 添加背景板
            具体配置： https://reactflow.dev/api-reference/components/background
            color: 图案颜色
            bgColor: 背景颜色
            variant: 图案样式
        */}
                <Background
                    bgColor='#f4f5ee'
                    size={1.2}
                    variant={BackgroundVariant.Dots}
                    gap={28}
                />
                <Panel position="top-right"><BoardToolkit /></Panel>
                <Panel position="top-left"><InfoOverview /></Panel>
                <Controls position="bottom-left" showInteractive={false} />
                {/* ViewPorts固定视图 */}
                <MeetingReport />
                <KnowMe />
                <MiniMap pannable zoomable nodeColor={nodeColor} />
            </ReactFlow>
        </div>
    )
}