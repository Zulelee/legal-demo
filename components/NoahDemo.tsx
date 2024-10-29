"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { PlusCircle, FileText, User, ChevronDown } from "lucide-react";

const nodeTypes = {
  contractTemplate: ({ data, id }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-blue-100 border-2 border-blue-500 relative">
      <button 
        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
        onClick={() => data.onDelete(id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.description}</div>
    </div>
  ),
  section: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-100 border-2 border-green-500">
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.description}</div>
    </div>
  ),
  clause: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-100 border-2 border-yellow-500">
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.text}</div>
    </div>
  ),
  variable: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-500">
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.type}</div>
    </div>
  ),
  conditionalLogic: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-red-100 border-2 border-red-500">
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.condition}</div>
    </div>
  ),
  userJourney: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-orange-100 border-2 border-orange-500">
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.description}</div>
    </div>
  ),
  country: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-indigo-100 border-2 border-indigo-500">
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.description}</div>
    </div>
  ),
  custom: ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-gray-100 border-2 border-gray-500">
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">{data.description}</div>
    </div>
  ),
};

const createInitialNodes = (deleteNode: (id: string) => void): Node[] => [
  {
    id: "1",
    type: "contractTemplate",
    data: {
      label: "NDA Template",
      description: "Standard Non-Disclosure Agreement",
    },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    type: "section",
    data: { label: "Introduction", description: "Parties and purpose" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    type: "section",
    data: {
      label: "Confidential Information",
      description: "Definition and scope",
    },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    type: "clause",
    data: {
      label: "Parties",
      text: "This Agreement is between @CompanyName and @RecipientName",
    },
    position: { x: 50, y: 200 },
  },
  {
    id: "5",
    type: "clause",
    data: { label: "Definition", text: "Confidential Information includes..." },
    position: { x: 350, y: 200 },
  },
  {
    id: "6",
    type: "variable",
    data: { label: "@CompanyName", type: "String" },
    position: { x: 0, y: 300 },
  },
  {
    id: "7",
    type: "variable",
    data: { label: "@RecipientName", type: "String" },
    position: { x: 150, y: 300 },
  },
  {
    id: "8",
    type: "conditionalLogic",
    data: {
      label: "Include Legal Disclosure",
      condition: "If @IncludeLegalDisclosure is true",
    },
    position: { x: 500, y: 300 },
  },
  {
    id: "9",
    type: "userJourney",
    data: { label: "User Sign Up", description: "User creates an account" },
    position: { x: 0, y: 400 },
  },
  {
    id: "10",
    type: "userJourney",
    data: {
      label: "Contract Generation",
      description: "AI generates personalized contract",
    },
    position: { x: 200, y: 400 },
  },
  {
    id: "11",
    type: "userJourney",
    data: {
      label: "Contract Delivery",
      description: "User receives final contract",
    },
    position: { x: 400, y: 400 },
  },
  {
    id: "12",
    type: "country",
    data: { label: "United States", description: "US-specific clauses" },
    position: { x: 600, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e3-5", source: "3", target: "5", animated: true },
  { id: "e4-6", source: "4", target: "6", animated: true },
  { id: "e4-7", source: "4", target: "7", animated: true },
  { id: "e3-8", source: "3", target: "8", animated: true },
  {
    id: "e9-10",
    source: "9",
    target: "10",
    type: "step",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e10-11",
    source: "10",
    target: "11",
    type: "step",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  { id: "e1-12", source: "1", target: "12", animated: true },
];

export default function AdvancedContractTemplateGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map(node => ({
      ...node,
      data: { ...node.data, onDelete: deleteNode }
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodeType, setNodeType] = useState("contractTemplate");
  const [fileFormat, setFileFormat] = useState("pdf");
  const [openAccordion, setOpenAccordion] = useState("");

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "smoothstep", animated: true }, eds)
      ),
    [setEdges]
  );

  const addNode = useCallback((type: string, label: string, description: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      data: { 
        label: label || nodeName, 
        description: description || nodeDescription,
        onDelete: deleteNode
      },
      position: { x: Math.random() * 500, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeName("");
    setNodeDescription("");
  }, [nodeName, nodeDescription, deleteNode]);

  const toggleAccordion = (value: string) => {
    setOpenAccordion(openAccordion === value ? "" : value);
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4 flex flex-col overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Contract Builder</h2>
        <div className="space-y-2">
          <div className="border rounded-md">
            <button
              className="w-full p-2 text-left font-semibold flex justify-between items-center"
              onClick={() => toggleAccordion("contract-templates")}
            >
              Contract Templates
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openAccordion === "contract-templates"
                    ? "transform rotate-180"
                    : ""
                }`}
              />
            </button>
            {openAccordion === "contract-templates" && (
              <div className="p-2">
                <button
                  className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => addNode("contractTemplate", "New Contract Template", "Template Description")}
                >
                  <FileText className="mr-2 h-4 w-4" /> Add Template
                </button>
              </div>
            )}
          </div>
          <div className="border rounded-md">
            <button
              className="w-full p-2 text-left font-semibold flex justify-between items-center"
              onClick={() => toggleAccordion("sections-clauses")}
            >
              Sections & Clauses
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openAccordion === "sections-clauses"
                    ? "transform rotate-180"
                    : ""
                }`}
              />
            </button>
            {openAccordion === "sections-clauses" && (
              <div className="p-2 space-y-2">
                <button
                  className="w-full p-2 bg-green-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => setNodeType("section")}
                >
                  <FileText className="mr-2 h-4 w-4" /> Add Section
                </button>
                <button
                  className="w-full p-2 bg-yellow-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => setNodeType("clause")}
                >
                  <FileText className="mr-2 h-4 w-4" /> Add Clause
                </button>
              </div>
            )}
          </div>
          <div className="border rounded-md">
            <button
              className="w-full p-2 text-left font-semibold flex justify-between items-center"
              onClick={() => toggleAccordion("attributes")}
            >
              Attributes
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openAccordion === "attributes" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "attributes" && (
              <div className="p-2 space-y-2">
                <button
                  className="w-full p-2 bg-purple-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => setNodeType("variable")}
                >
                  <FileText className="mr-2 h-4 w-4" /> Add Variable
                </button>
                <button
                  className="w-full p-2 bg-red-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => setNodeType("conditionalLogic")}
                >
                  <FileText className="mr-2 h-4 w-4" /> Add Condition
                </button>
              </div>
            )}
          </div>
          <div className="border rounded-md">
            <button
              className="w-full p-2 text-left font-semibold flex justify-between items-center"
              onClick={() => toggleAccordion("countries")}
            >
              Countries
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openAccordion === "countries" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "countries" && (
              <div className="p-2">
                <button
                  className="w-full p-2 bg-indigo-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => setNodeType("country")}
                >
                  <FileText className="mr-2 h-4 w-4" /> Add Country
                </button>
              </div>
            )}
          </div>
          <div className="border rounded-md">
            <button
              className="w-full p-2 text-left font-semibold flex justify-between items-center"
              onClick={() => toggleAccordion("user-journey")}
            >
              User Journey
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openAccordion === "user-journey" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "user-journey" && (
              <div className="p-2">
                <button
                  className="w-full p-2 bg-orange-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => setNodeType("userJourney")}
                >
                  <User className="mr-2 h-4 w-4" /> Add Journey Step
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="nodeName"
            className="block text-sm font-medium text-gray-700"
          >
            Node Name
          </label>
          <input
            id="nodeName"
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mt-2">
          <label
            htmlFor="nodeDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="nodeDescription"
            type="text"
            value={nodeDescription}
            onChange={(e) => setNodeDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          className="mt-4 w-full p-2 bg-indigo-600 text-white rounded-md flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={addNode}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Node
        </button>
        <div className="mt-4">
          <label
            htmlFor="fileFormat"
            className="block text-sm font-medium text-gray-700"
          >
            Final Contract Format
          </label>
          <select
            id="fileFormat"
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="html">HTML</option>
          </select>
        </div>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
