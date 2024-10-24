'use client'

import { ReactFlowProvider } from 'reactflow'
import FlowCanvas from './FlowCanvas'
import 'reactflow/dist/style.css'

export default function Dashboard() {
  return (
    <div className="w-full h-screen">
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  )
}
