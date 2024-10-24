import { Handle, Position } from 'reactflow';

interface NodeData {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function HeaderNode({ data }: { data: NodeData }) {
  return (
    <div className="p-4 border-2 rounded-md bg-white min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="mb-2">Header</div>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Enter header text"
        value={data.value || ''}
        onChange={(e) => data.onChange?.(e.target.value)}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function ClauseNode({ data }: { data: NodeData }) {
  return (
    <div className="p-4 border-2 rounded-md bg-white min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="mb-2">Clause</div>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Enter clause text"
        value={data.value || ''}
        onChange={(e) => {
          data.value = e.target.value;
        }}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function OptionsNode({ data }: { data: NodeData }) {
  return (
    <div className="p-4 border-2 rounded-md bg-white min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="mb-2">Options</div>
      <select
        className="w-full p-2 border rounded"
        value={data.value || ''}
        onChange={(e) => {
          data.value = e.target.value;
        }}
      >
        <option value="">Select an option</option>
        <option value="opt1">Option 1</option>
        <option value="opt2">Option 2</option>
        <option value="opt3">Option 3</option>
      </select>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function DateNode({ data }: { data: NodeData }) {
  return (
    <div className="p-4 border-2 rounded-md bg-white min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="mb-2">Date</div>
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={data.value || ''}
        onChange={(e) => {
          data.value = e.target.value;
        }}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function FooterNode({ data }: { data: NodeData }) {
  return (
    <div className="p-4 border-2 rounded-md bg-white min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="mb-2">Footer</div>
      <select
        className="w-full p-2 border rounded mb-2"
        value={data.value || ''}
        onChange={(e) => {
          data.value = e.target.value;
        }}
      >
        <option value="">Select footer type</option>
        <option value="standard">Standard Footer</option>
        <option value="detailed">Detailed Footer</option>
        <option value="minimal">Minimal Footer</option>
      </select>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
