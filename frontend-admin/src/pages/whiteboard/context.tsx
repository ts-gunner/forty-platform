import type { Edge, Node } from '@xyflow/react'
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'


type WhiteBoardContextType = {
    nodes: Node[]
    setNodes: (v: SetStateAction<Node[]>) => void
    edges: Edge[]
    setEdges: (v: SetStateAction<Edge[]>) => void
}


const WhiteBoardContext = createContext<WhiteBoardContextType | undefined>(undefined)

export const useWhiteBoard = () => {

    const context = useContext(WhiteBoardContext)
    if (!context) {
        throw new Error("useWhiteBoard must be used within a Provider")
    }
    return context
}



export const WhiteBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    return (
        <WhiteBoardContext.Provider
            value={{
                nodes, setEdges, edges, setNodes,
            }}
        >
            {children}
        </WhiteBoardContext.Provider>
    )
}