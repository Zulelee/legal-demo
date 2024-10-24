import React from 'react'

const nodeTypes = [
  { type: 'input', label: 'Input Node' },
  { type: 'output', label: 'Output Node' },
  { type: 'default', label: 'Default Node' },
  { type: 'custom', label: 'Custom Node' },
  { type: 'special', label: 'Special Node' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <button
          onClick={onClose}
          className="mb-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
        <div className="space-y-4">
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              className="p-2 border rounded cursor-move bg-gray-50 hover:bg-gray-100"
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
