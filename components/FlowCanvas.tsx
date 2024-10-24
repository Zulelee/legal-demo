'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  addEdge,
  Node,
} from 'reactflow'
import Sidebar from './Sidebar'

const initialNodes: any[] = []
const initialEdges: Edge[] = []

export default function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      // Delete associated edges when nodes are deleted
      setEdges((eds) => 
        eds.filter(
          (edge) => 
            !nodesToDelete.some(
              (node) => node.id === edge.source || node.id === edge.target
            )
        )
      )
    },
    [setEdges]
  )

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    },
    [setEdges]
  )

  // Handle keyboard delete
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nds) => nds.filter((node) => !node.selected))
        setEdges((eds) => eds.filter((edge) => !edge.selected))
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [setNodes, setEdges])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, setNodes],
  )

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodesDelete={onNodesDelete}
        onEdgeClick={onEdgeClick}
        fitView
      >
        <Background />
        <Controls />
        <button
          className="absolute top-4 right-4 z-10 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
          onClick={() => setIsSidebarOpen(true)}
        >
          +
        </button>
      </ReactFlow>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
