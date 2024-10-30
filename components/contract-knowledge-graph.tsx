"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, History, Save, X } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

// Define component types and their configurations
const componentTypes = {
  entity: {
    label: "Entity",
    description: "Core elements like customer, employee, product",
    properties: ["name", "description", "identifier"],
  },
  attribute: {
    label: "Attribute",
    description: "Information storage like dates, prices, descriptions",
    properties: ["name", "type", "required"],
    types: ["String", "Number", "Date", "Boolean", "Currency"],
  },
  comboBox: {
    label: "Combo Option Box",
    description: "Multiple selection container",
    properties: ["name", "description", "minSelections", "maxSelections"],
  },
  exclusiveBox: {
    label: "Exclusive Option Box",
    description: "Single selection container",
    properties: ["name", "description", "defaultOption"],
  },
  option: {
    label: "Option",
    description: "Selection item for combo or exclusive boxes",
    properties: ["name", "value", "description"],
  },
  group: {
    label: "Group",
    description: "Organizational container for nodes",
    properties: ["name", "description"],
  },
  multiplier: {
    label: "Multiplier",
    description: "Container for repeated elements",
    properties: ["name", "description", "minItems", "maxItems"],
  },
};

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: {
      label: "Contract Agreement",
      details: "Root node for all contract elements",
      type: "entity",
      version: 1,
    },
    type: "input",
  },
];

const initialEdges: Edge[] = [];

interface Version {
  id: number;
  timestamp: string;
  nodes: Node[];
  edges: Edge[];
}

// Custom edge component with delete button
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { deleteElements } = useReactFlow();

  const onEdgeClick = (
    evt: React.MouseEvent<SVGGElement, MouseEvent>,
    id: string
  ) => {
    evt.stopPropagation();
    deleteElements({ edges: [{ id }] });
  };

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeDasharray: "5,5",
          animation: "dashdraw 0.5s linear infinite",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g
        transform={`translate(${labelX - 10} ${labelY - 10})`}
        className="cursor-pointer"
        onClick={(event) => onEdgeClick(event, id)}
      >
        <circle r="10" fill="white" />
        <X size={14} className="text-gray-500" />
      </g>
    </>
  );
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [versions, setVersions] = useState<Version[]>([
    {
      id: 1,
      timestamp: new Date().toISOString(),
      nodes: initialNodes,
      edges: initialEdges,
    },
  ]);
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const { deleteElements } = useReactFlow();
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: "custom" }, eds));
      toast({
        title: "Connection Created",
        description: "A new connection has been established between nodes.",
      });
    },
    [setEdges, toast]
  );

  const addNode = useCallback(
    (type: string) => {
      const newNode: Node = {
        id: (nodes.length + 1).toString(),
        data: {
          label: `New ${componentTypes[type].label}`,
          details: "",
          type: type,
          version: currentVersion,
          properties: {},
        },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      };
      setNodes((nds) => [...nds, newNode]);
      toast({
        title: "Node Added",
        description: `A new ${componentTypes[type].label} node has been added to the graph.`,
      });
    },
    [nodes, setNodes, currentVersion, toast]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeDetails = useCallback(
    (id: string, updates: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updates,
                version: currentVersion,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes, currentVersion]
  );

  const deleteNode = useCallback(
    (id: string) => {
      deleteElements({ nodes: [{ id }] });
      toast({
        title: "Node Deleted",
        description: "The selected node has been removed from the graph.",
        variant: "destructive",
      });
    },
    [deleteElements, toast]
  );

  const saveVersion = useCallback(() => {
    const newVersion = {
      id: versions.length + 1,
      timestamp: new Date().toISOString(),
      nodes: nodes,
      edges: edges,
    };
    setVersions((prev) => [...prev, newVersion]);
    setCurrentVersion(newVersion.id);
    toast({
      title: "Version Saved",
      description: `Version ${newVersion.id} has been saved successfully.`,
    });
  }, [nodes, edges, versions, toast]);

  const loadVersion = useCallback(
    (versionId: number) => {
      const version = versions.find((v) => v.id === versionId);
      if (version) {
        setNodes(version.nodes);
        setEdges(version.edges);
        setCurrentVersion(versionId);
        toast({
          title: "Version Loaded",
          description: `Version ${versionId} has been loaded successfully.`,
        });
      }
    },
    [versions, setNodes, setEdges, toast]
  );

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-background border-r">
        <div className="p-4 border-b">
          <Select
            value={currentVersion.toString()}
            onValueChange={(v) => loadVersion(parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version.id} value={version.id.toString()}>
                  Version {version.id} (
                  {new Date(version.timestamp).toLocaleString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full mt-2" onClick={saveVersion}>
            <Save className="mr-2 h-4 w-4" />
            Save Version
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4">
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(componentTypes).map(([type, config]) => (
                <AccordionItem value={type} key={type}>
                  <AccordionTrigger>{config.label}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {config.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addNode(type)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add {config.label}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          connectionMode={ConnectionMode.Loose}
          fitView
          deleteKeyCode="Delete"
          edgeTypes={{
            custom: CustomEdge,
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {selectedNode && (
        <Dialog
          open={!!selectedNode}
          onOpenChange={() => setSelectedNode(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedNode.data.label}</DialogTitle>
              <DialogDescription>
                {componentTypes[selectedNode.data.type]?.description ||
                  "Edit Node Details"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={selectedNode.data.label}
                  onChange={(e) =>
                    updateNodeDetails(selectedNode.id, {
                      label: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedNode.data.details}
                  onChange={(e) =>
                    updateNodeDetails(selectedNode.id, {
                      details: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
              {selectedNode.data.type === "attribute" && (
                <div>
                  <Label>Type</Label>
                  <Select
                    value={selectedNode.data.properties?.type || "String"}
                    onValueChange={(value) =>
                      updateNodeDetails(selectedNode.id, {
                        properties: {
                          ...selectedNode.data.properties,
                          type: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.attribute.types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {(selectedNode.data.type === "comboBox" ||
                selectedNode.data.type === "multiplier") && (
                <>
                  <div>
                    <Label>Minimum Items</Label>
                    <Input
                      type="number"
                      value={selectedNode.data.properties?.minItems || 0}
                      onChange={(e) =>
                        updateNodeDetails(selectedNode.id, {
                          properties: {
                            ...selectedNode.data.properties,
                            minItems: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Maximum Items</Label>
                    <Input
                      type="number"
                      value={selectedNode.data.properties?.maxItems || 0}
                      onChange={(e) =>
                        updateNodeDetails(selectedNode.id, {
                          properties: {
                            ...selectedNode.data.properties,
                            maxItems: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteNode(selectedNode.id);
                  setSelectedNode(null);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Node
              </Button>
              <Button onClick={() => setSelectedNode(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function ContractKnowledgeGraphComponent() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
