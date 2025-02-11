import { useState, useCallback, useMemo } from 'react';
import { Session, WorkflowNode, WorkflowEdge, WorkflowPath, WorkflowMetrics } from '../types/workflow';

interface UseWorkflowGraphProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  sessions: Session[];
}

interface UseWorkflowGraphReturn {
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  hoveredNode: string | null;
  setHoveredNode: (nodeId: string | null) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
  filteredNodes: WorkflowNode[];
  filteredEdges: WorkflowEdge[];
  metrics: WorkflowMetrics;
  getNodeColor: (nodeId: string) => string;
  getEdgeStyle: (edge: WorkflowEdge) => {
    stroke: string;
    strokeWidth: number;
  };
  resetView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const ZOOM_FACTOR = 1.2;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;

const COLORS = {
  node: {
    default: '#6366f1', // Indigo-500
    hover: '#4f46e5',   // Indigo-600
    inactive: '#d1d5db', // Gray-300
    start: '#22c55e',    // Green-500
    end: '#ef4444',      // Red-500
    decision: '#f59e0b'  // Amber-500
  },
  edge: {
    optimal: '#22c55e',    // Green-500
    suboptimal: '#f59e0b', // Amber-500
    inefficient: '#ef4444' // Red-500
  }
};

export function useWorkflowGraph({
  nodes,
  edges,
  sessions
}: UseWorkflowGraphProps): UseWorkflowGraphReturn {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Filter nodes and edges based on selected sessions
  const filteredNodes = useMemo(() => {
    if (selectedSessions.length === 0) return nodes;
    
    const activeNodeIds = new Set<string>();
    selectedSessions.forEach(sessionId => {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;
      
      // Add all nodes in the session's path
      edges.forEach(edge => {
        if (edge.sessionCount > 0) {
          activeNodeIds.add(edge.source);
          activeNodeIds.add(edge.target);
        }
      });
    });
    
    return nodes.filter(node => activeNodeIds.has(node.id));
  }, [nodes, edges, sessions, selectedSessions]);

  const filteredEdges = useMemo(() => {
    if (selectedSessions.length === 0) return edges;
    
    return edges.filter(edge => {
      return selectedSessions.some(sessionId => {
        const session = sessions.find(s => s.id === sessionId);
        return session && edge.sessionCount > 0;
      });
    });
  }, [edges, sessions, selectedSessions]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSessions = sessions.length;
    const averageDuration = sessions.reduce((acc, session) => acc + session.duration, 0) / totalSessions;
    
    const inefficientPaths = sessions.filter(session => session.status === 'inefficient').length;
    
    // Find common bottlenecks (nodes with high time spent)
    const bottlenecks = nodes
      .filter(node => node.efficiency === 'slow')
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 3)
      .map(node => node.label);
    
    // Calculate optimization score (0-100)
    const optimizationScore = 100 - (inefficientPaths / totalSessions * 100);

    return {
      totalSessions,
      averageDuration,
      inefficientPaths,
      commonBottlenecks: bottlenecks,
      optimizationScore
    };
  }, [nodes, sessions]);

  const getNodeColor = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return COLORS.node.default;

    if (hoveredNode === nodeId) return COLORS.node.hover;
    
    if (node.type === 'start') return COLORS.node.start;
    if (node.type === 'end') return COLORS.node.end;
    if (node.type === 'decision') return COLORS.node.decision;
    
    if (selectedSessions.length === 0) return COLORS.node.default;
    
    return filteredNodes.some(n => n.id === nodeId)
      ? COLORS.node.default
      : COLORS.node.inactive;
  }, [nodes, hoveredNode, selectedSessions, filteredNodes]);

  const getEdgeStyle = useCallback((edge: WorkflowEdge) => {
    const baseWidth = 2;
    const frequencyScale = Math.min(edge.frequency * 3, 6);
    
    let color = COLORS.edge.optimal;
    if (edge.efficiency === 'inefficient') color = COLORS.edge.inefficient;
    else if (edge.efficiency === 'suboptimal') color = COLORS.edge.suboptimal;

    return {
      stroke: color,
      strokeWidth: baseWidth + frequencyScale
    };
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(z => Math.min(z * ZOOM_FACTOR, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(z => Math.max(z / ZOOM_FACTOR, MIN_ZOOM));
  }, []);

  return {
    selectedSessions,
    setSelectedSessions,
    hoveredNode,
    setHoveredNode,
    zoom,
    setZoom,
    pan,
    setPan,
    filteredNodes,
    filteredEdges,
    metrics,
    getNodeColor,
    getEdgeStyle,
    resetView,
    zoomIn,
    zoomOut
  };
} 