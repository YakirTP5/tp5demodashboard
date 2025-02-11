import React, { useRef, useEffect, useState } from 'react';
import { 
  Search, Filter, Clock, AlertTriangle, User,
  ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize2,
  Download, Share2
} from 'lucide-react';
import { Session, WorkflowNode, WorkflowEdge } from '../types/workflow';
import { useWorkflowGraph } from '../hooks/useWorkflowGraph';

interface WorkflowGraphProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  sessions: Session[];
  onNodeClick?: (nodeId: string) => void;
  onExport?: () => void;
  onShare?: () => void;
}

const WorkflowGraph: React.FC<WorkflowGraphProps> = ({
  nodes,
  edges,
  sessions,
  onNodeClick,
  onExport,
  onShare
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isSessionListCollapsed, setIsSessionListCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Initialize with the first session selected
  const initialSelectedSession = sessions.length > 0 ? [sessions[0].id] : [];

  const {
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
  } = useWorkflowGraph({ nodes, edges, sessions });

  // Generate and memoize session paths
  const sessionPaths = React.useMemo(() => {
    const paths = new Map<string, string[]>();
    
    sessions.forEach(session => {
      // Find start node
      const startNode = nodes.find(n => n.type === 'start');
      const endNodes = nodes.filter(n => n.type === 'end');
      
      if (!startNode || endNodes.length === 0) return;
      
      let currentNode = startNode;
      const path: string[] = [startNode.id];
      
      // Generate a random path from start to end
      while (currentNode && !endNodes.some(n => n.id === currentNode.id)) {
        const possibleEdges = edges.filter(e => 
          e.source === currentNode.id && 
          !path.includes(e.target)
        );
        
        if (possibleEdges.length === 0) break;
        
        // Choose a random edge
        const nextEdge = possibleEdges[Math.floor(Math.random() * possibleEdges.length)];
        const nextNode = nodes.find(n => n.id === nextEdge.target);
        
        if (nextNode) {
          path.push(nextNode.id);
          currentNode = nextNode;
        } else {
          break;
        }
      }
      
      paths.set(session.id, path);
    });
    
    return paths;
  }, [nodes, edges, sessions]);

  // Set initial session on mount
  useEffect(() => {
    if (initialSelectedSession.length > 0 && selectedSessions.length === 0) {
      setSelectedSessions(initialSelectedSession);
    }
  }, []);

  // Handle mouse events for pan and zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoom * delta, 0.1), 3);
      setZoom(newZoom);
    } else {
      const newPan = {
        x: pan.x - e.deltaX,
        y: pan.y - e.deltaY
      };
      setPan(newPan);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Format utilities
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'optimized': return '🟢';
      case 'slight-delay': return '🟡';
      case 'inefficient': return '🔴';
      default: return '⚪';
    }
  };

  // Filter sessions based on search term
  const filteredSessions = sessions.filter(session =>
    session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.agent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate SVG viewBox based on filtered nodes
  const viewBox = {
    minX: Math.min(...filteredNodes.map(n => n.position.x)) - 100,
    minY: Math.min(...filteredNodes.map(n => n.position.y)) - 100,
    maxX: Math.max(...filteredNodes.map(n => n.position.x)) + 100,
    maxY: Math.max(...filteredNodes.map(n => n.position.y)) + 100,
  };

  // Update path checking functions
  const isInSelectedPath = (nodeId: string): boolean => {
    if (selectedSessions.length === 0) return true;
    
    return selectedSessions.some(sessionId => {
      const path = sessionPaths.get(sessionId);
      return path?.includes(nodeId) ?? false;
    });
  };

  const isEdgeInSelectedPath = (edge: WorkflowEdge): boolean => {
    if (selectedSessions.length === 0) return true;
    
    return selectedSessions.some(sessionId => {
      const path = sessionPaths.get(sessionId);
      if (!path) return false;
      
      // Check if this edge connects two consecutive nodes in the path
      const sourceIndex = path.indexOf(edge.source);
      return sourceIndex !== -1 && path[sourceIndex + 1] === edge.target;
    });
  };

  return (
    <div className="flex h-full">
      {/* Session List Panel */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isSessionListCollapsed ? 'w-16' : 'w-80'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`font-medium ${isSessionListCollapsed ? 'hidden' : 'block'}`}>
              Sessions
            </h2>
            <button
              onClick={() => setIsSessionListCollapsed(prev => !prev)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isSessionListCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
          {!isSessionListCollapsed && (
            <>
              <div className="mt-2 relative">
                <input
                  type="text"
                  placeholder="Search sessions..."
                  className="w-full pl-8 pr-4 py-2 border rounded-md text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-1" />
                <span>Filter by status</span>
              </div>
            </>
          )}
        </div>
        <div className="overflow-y-auto h-[calc(100vh-9rem)]">
          {!isSessionListCollapsed && filteredSessions.map(session => (
            <div
              key={session.id}
              onClick={() => setSelectedSessions([session.id])}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                selectedSessions.includes(session.id) ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{session.sessionId}</span>
                <span>{getStatusIcon(session.status)}</span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(session.duration)}
                </div>
                <div className="flex items-center text-gray-500">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {`${session.inefficiencyScore}m wasted`}
                </div>
                <div className="flex items-center text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {session.agent}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Graph Panel */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full">
          <div className="mb-4 flex justify-between items-center">
            <div className="pt-2">
              <h2 className="text-lg font-medium">Workflow Visualization</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedSessions.length > 0 
                  ? `Showing path for Session ${selectedSessions.map(id => sessions.find(s => s.id === id)?.sessionId).join(', ')}`
                  : 'Select a session to highlight its path'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={zoomOut}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                onClick={zoomIn}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={resetView}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Reset View"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
              <button
                onClick={onExport}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Export Data"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={onShare}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="mb-4 grid grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Sessions</div>
              <div className="text-2xl font-semibold">{metrics.totalSessions}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Avg Duration</div>
              <div className="text-2xl font-semibold">{formatDuration(metrics.averageDuration)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Inefficient Paths</div>
              <div className="text-2xl font-semibold">{metrics.inefficientPaths}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Optimization Score</div>
              <div className="text-2xl font-semibold">{Math.round(metrics.optimizationScore)}%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Top Bottleneck</div>
              <div className="text-lg font-semibold truncate">
                {metrics.commonBottlenecks[0] || 'None'}
              </div>
            </div>
          </div>

          {/* SVG Graph */}
          <svg
            ref={svgRef}
            className="w-full h-[calc(100%-8rem)]"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-strong">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {filteredEdges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const style = getEdgeStyle(edge);
                const isHighlighted = isEdgeInSelectedPath(edge);
                return (
                  <g key={`${edge.source}-${edge.target}`}>
                    {isHighlighted && (
                      <line
                        x1={sourceNode.position.x}
                        y1={sourceNode.position.y}
                        x2={targetNode.position.x}
                        y2={targetNode.position.y}
                        stroke={style.stroke}
                        strokeWidth={style.strokeWidth + 4}
                        opacity={0.3}
                        filter="url(#glow)"
                      />
                    )}
                    <line
                      x1={sourceNode.position.x}
                      y1={sourceNode.position.y}
                      x2={targetNode.position.x}
                      y2={targetNode.position.y}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                      opacity={isHighlighted ? 1 : 0.02}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(node => {
                const color = getNodeColor(node.id);
                const nodeSize = 30;
                const isHighlighted = isInSelectedPath(node.id);
                
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.position.x},${node.position.y})`}
                    onClick={() => onNodeClick?.(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isHighlighted && (
                      <circle
                        r={nodeSize + 4}
                        fill={color}
                        opacity={0.3}
                        filter="url(#glow-strong)"
                      />
                    )}
                    <circle
                      r={nodeSize}
                      fill={color}
                      opacity={isHighlighted ? 1 : 0.02}
                      className={isHighlighted ? 'stroke-2 stroke-white' : ''}
                    />
                    <foreignObject
                      x={-nodeSize}
                      y={-nodeSize/2}
                      width={nodeSize * 2}
                      height={nodeSize}
                      style={{
                        overflow: 'visible',
                        pointerEvents: 'none'
                      }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <span
                          className={`text-white text-sm font-medium whitespace-nowrap px-1 ${
                            isHighlighted ? 'opacity-100 drop-shadow-lg' : 'opacity-10'
                          }`}
                          style={{
                            textAlign: 'center',
                            maxWidth: `${nodeSize * 2}px`,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {node.label}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WorkflowGraph; 