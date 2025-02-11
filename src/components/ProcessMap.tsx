import React, { useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  MarkerType,
  Handle,
  MiniMap,
  Panel
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { ProcessMapData, ProcessSession, ProcessNode as ProcessNodeType } from '../types/processMap';

// Custom node types
const ActionNode = ({ data }: { data: { label: string } }) => (
  <div className="px-4 py-2 shadow-lg rounded-md bg-white border-2 border-gray-200 min-w-[150px]">
    <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    <div className="font-medium text-center">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
  </div>
);

const DecisionNode = ({ data }: { data: { label: string } }) => (
  <div className="px-4 py-2 shadow-lg bg-white border-2 border-gray-200 rotate-45 min-w-[150px] min-h-[80px] flex items-center justify-center">
    <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    <div className="-rotate-45 font-medium text-center">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    <Handle type="source" position={Position.Right} className="!bg-gray-400" />
  </div>
);

const StartEndNode = ({ data }: { data: { label: string } }) => (
  <div className="px-6 py-3 shadow-lg rounded-full bg-white border-2 border-gray-200 min-w-[150px]">
    <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    <div className="font-medium text-center">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
  </div>
);

const nodeTypes = {
  action: ActionNode,
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
};

// Layout helper function
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 80,
    nodesep: 50,
    edgesep: 30,
    marginx: 50,
    marginy: 50
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

interface ProcessMapProps {
  data: ProcessMapData;
}

const ProcessMap: React.FC<ProcessMapProps> = ({ data }) => {
  const [selectedSession, setSelectedSession] = useState<ProcessSession | null>(null);
  const [orientation, setOrientation] = useState<'TB' | 'LR'>('TB');

  const { nodes, edges } = useMemo(() => {
    const baseNodes = data.nodes.map((node: ProcessNodeType) => ({
      id: node.id,
      data: { label: node.label },
      type: node.type,
      position: { x: 0, y: 0 },
      style: {
        background: selectedSession?.path.includes(node.id) ? '#4ade80' : '#fff',
      },
    }));
    return getLayoutedElements(baseNodes, data.edges, orientation);
  }, [data.nodes, data.edges, selectedSession, orientation]);

  const flowEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      type: 'smoothstep',
      animated: selectedSession?.path.includes(edge.source) && 
                selectedSession?.path.includes(edge.target),
      style: {
        stroke: selectedSession?.path.includes(edge.source) && 
                selectedSession?.path.includes(edge.target) 
                ? '#4ade80' 
                : '#555',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));
  }, [edges, selectedSession]);

  return (
    <div className="w-full h-full flex">
      <div className="w-72 p-4 border-r bg-gray-50 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Sessions</h2>
        <div className="space-y-2">
          {data.sessions.map((session) => (
            <button
              key={session.id}
              className={`w-full p-3 text-left rounded-lg border ${
                selectedSession?.id === session.id
                  ? 'bg-green-100 border-green-500'
                  : 'bg-white border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedSession(session)}
            >
              <div className="font-medium">Session {session.id}</div>
              <div className="text-sm text-gray-500">
                {new Date(session.timestamp).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">User: {session.userId}</div>
              <div className="text-xs text-gray-400 mt-1">
                Steps: {session.path.length}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 h-[800px] bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'decision':
                  return '#f0f0f0';
                case 'start':
                case 'end':
                  return '#e0e0e0';
                default:
                  return '#fff';
              }
            }}
          />
          <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-md">
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              onClick={() => setOrientation(prev => prev === 'TB' ? 'LR' : 'TB')}
            >
              {orientation === 'TB' ? 'Switch to Horizontal' : 'Switch to Vertical'}
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default ProcessMap; 