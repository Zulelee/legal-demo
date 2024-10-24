import React from 'react';
import { Node } from 'reactflow';

interface FormPreviewProps {
  nodes: Node[];
}

export default function FormPreview({ nodes }: FormPreviewProps) {
  const sortedNodes = [...nodes].sort((a, b) => {
    const aY = a.position.y;
    const bY = b.position.y;
    return aY - bY;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 max-h-[30vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Form Preview</h3>
      <div className="space-y-4">
        {sortedNodes.map((node) => (
          <div key={node.id} className="border p-2 rounded">
            <strong>{node.data.label}:</strong> {node.data.value || 'Not set'}
          </div>
        ))}
      </div>
    </div>
  );
}
