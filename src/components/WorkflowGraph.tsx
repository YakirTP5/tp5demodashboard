import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Filter, Clock, AlertTriangle, User,
  ChevronLeft, ChevronRight,
  Play as PlayIcon, Zap, ArrowRight, X,
  ZoomIn, ZoomOut, Maximize2,
  ChevronLeftCircle, ChevronRightCircle
} from 'lucide-react';
import AiInsightsPanel from './AiInsightsPanel';

interface Session {
  id: string;
  sessionId: string;
  duration: number;
  inefficiencyScore?: number;
  agent?: string;
  status: 'optimized' | 'slight-delay' | 'inefficient';
  workflowId: string;
}

interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  timeSpent: number;
  aiRecommendation?: string;
  efficiency: 'fast' | 'moderate' | 'slow';
  videoTimestamp?: number;
}

interface WorkflowEdge {
  source: string;
  target: string;
  frequency: number;
  efficiency: 'optimal' | 'suboptimal' | 'inefficient';
}

interface SessionPaths {
  [key: string]: string[];
}

interface NodePosition {
  x: number;
  y: number;
}

interface NodePositions {
  [key: string]: NodePosition;
}

// Mock data for initial development
const mockSessions: Session[] = [
  {
    id: '1',
    sessionId: 'S-001',
    duration: 765, // seconds
    inefficiencyScore: 3.2,
    agent: 'John Doe',
    status: 'inefficient',
    workflowId: 'WF-001'
  },
  {
    id: '2',
    sessionId: 'S-002',
    duration: 450,
    inefficiencyScore: 1.5,
    agent: 'Jane Smith',
    status: 'slight-delay',
    workflowId: 'WF-001'
  },
  {
    id: '3',
    sessionId: 'S-003',
    duration: 380,
    inefficiencyScore: 0.8,
    agent: 'Mike Johnson',
    status: 'optimized',
    workflowId: 'WF-001'
  }
];

// Update mock nodes with more complex workflow steps
const mockNodes: WorkflowNode[] = [
  {
    id: 'n1',
    label: 'Ticket Created',
    type: 'start',
    timeSpent: 60,
    aiRecommendation: 'Auto-categorize tickets using NLP',
    efficiency: 'moderate',
    videoTimestamp: 0
  },
  {
    id: 'n2',
    label: 'Initial Triage',
    type: 'decision',
    timeSpent: 180,
    aiRecommendation: 'Use AI to assess ticket priority and route automatically',
    efficiency: 'slow',
    videoTimestamp: 60
  },
  {
    id: 'n3',
    label: 'Log Analysis',
    type: 'analysis',
    timeSpent: 240,
    aiRecommendation: 'AI Copilot can auto-fetch relevant entries',
    efficiency: 'slow',
    videoTimestamp: 240
  },
  {
    id: 'n4',
    label: 'Error Check',
    type: 'validation',
    timeSpent: 120,
    aiRecommendation: 'Automated error pattern recognition',
    efficiency: 'moderate',
    videoTimestamp: 480
  },
  {
    id: 'n5',
    label: 'Wiki Search',
    type: 'research',
    timeSpent: 300,
    aiRecommendation: 'Smart knowledge base integration',
    efficiency: 'slow',
    videoTimestamp: 600
  },
  {
    id: 'n6',
    label: 'Code Review',
    type: 'analysis',
    timeSpent: 420,
    aiRecommendation: 'AI-powered code analysis',
    efficiency: 'moderate',
    videoTimestamp: 900
  },
  {
    id: 'n7',
    label: 'Solution Dev',
    type: 'development',
    timeSpent: 600,
    aiRecommendation: 'AI-assisted code generation',
    efficiency: 'moderate',
    videoTimestamp: 1320
  },
  {
    id: 'n8',
    label: 'Quick Fix',
    type: 'action',
    timeSpent: 180,
    aiRecommendation: 'Automated fix suggestions',
    efficiency: 'fast',
    videoTimestamp: 1500
  },
  {
    id: 'n9',
    label: 'Testing',
    type: 'validation',
    timeSpent: 240,
    aiRecommendation: 'Automated test generation',
    efficiency: 'moderate',
    videoTimestamp: 1740
  },
  {
    id: 'n10',
    label: 'Documentation',
    type: 'documentation',
    timeSpent: 180,
    aiRecommendation: 'AI-powered documentation generation',
    efficiency: 'moderate',
    videoTimestamp: 1920
  },
  {
    id: 'n11',
    label: 'Response',
    type: 'communication',
    timeSpent: 120,
    aiRecommendation: 'Smart response templates',
    efficiency: 'fast',
    videoTimestamp: 2040
  }
];

// Update edges for complex workflow
const mockEdges: WorkflowEdge[] = [
  // Main path
  {
    source: 'n1',
    target: 'n2',
    frequency: 1.0,
    efficiency: 'optimal'
  },
  // Complex issue path
  {
    source: 'n2',
    target: 'n3',
    frequency: 0.7,
    efficiency: 'suboptimal'
  },
  {
    source: 'n3',
    target: 'n4',
    frequency: 0.7,
    efficiency: 'suboptimal'
  },
  {
    source: 'n4',
    target: 'n5',
    frequency: 0.5,
    efficiency: 'inefficient'
  },
  {
    source: 'n5',
    target: 'n6',
    frequency: 0.4,
    efficiency: 'inefficient'
  },
  {
    source: 'n6',
    target: 'n7',
    frequency: 0.4,
    efficiency: 'suboptimal'
  },
  {
    source: 'n7',
    target: 'n9',
    frequency: 0.4,
    efficiency: 'optimal'
  },
  // Quick fix path
  {
    source: 'n2',
    target: 'n8',
    frequency: 0.3,
    efficiency: 'optimal'
  },
  {
    source: 'n8',
    target: 'n9',
    frequency: 0.3,
    efficiency: 'optimal'
  },
  // Documentation and response
  {
    source: 'n9',
    target: 'n10',
    frequency: 0.7,
    efficiency: 'optimal'
  },
  {
    source: 'n10',
    target: 'n11',
    frequency: 0.7,
    efficiency: 'optimal'
  },
  // Direct paths
  {
    source: 'n4',
    target: 'n8',
    frequency: 0.2,
    efficiency: 'optimal'
  },
  {
    source: 'n5',
    target: 'n11',
    frequency: 0.1,
    efficiency: 'optimal'
  }
];

// Update node positions for top-down layout
const nodePositions: NodePositions = {
  n1: { x: 400, y: 50 },    // Start
  n2: { x: 400, y: 150 },   // Initial Triage
  n3: { x: 250, y: 250 },   // Log Analysis
  n4: { x: 250, y: 350 },   // Error Check
  n5: { x: 250, y: 450 },   // Wiki Search
  n6: { x: 250, y: 550 },   // Code Review
  n7: { x: 250, y: 650 },   // Solution Dev
  n8: { x: 550, y: 350 },   // Quick Fix
  n9: { x: 400, y: 750 },   // Testing
  n10: { x: 400, y: 850 },  // Documentation
  n11: { x: 400, y: 950 }   // Response
};

// Update session paths for more complex flows
const mockSessionPaths: SessionPaths = {
  '1': ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n9', 'n10', 'n11'], // Complex path
  '2': ['n1', 'n2', 'n8', 'n9', 'n10', 'n11'],                          // Quick fix path
  '3': ['n1', 'n2', 'n3', 'n4', 'n8', 'n9', 'n10', 'n11']              // Mixed path
};

function WorkflowGraph() {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isSessionListCollapsed, setIsSessionListCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate SVG viewBox based on node positions
  const viewBox = {
    minX: Math.min(...Object.values(nodePositions).map(pos => pos.x)) - 100,
    minY: Math.min(...Object.values(nodePositions).map(pos => pos.y)) - 100,
    maxX: Math.max(...Object.values(nodePositions).map(pos => pos.x)) + 100,
    maxY: Math.max(...Object.values(nodePositions).map(pos => pos.y)) + 100,
  };

  const viewBoxWidth = viewBox.maxX - viewBox.minX;
  const viewBoxHeight = viewBox.maxY - viewBox.minY;

  // Add effect to handle initial zoom and positioning
  useEffect(() => {
    const updateGraphPosition = () => {
      if (svgRef.current) {
        const containerWidth = svgRef.current.clientWidth;
        const containerHeight = svgRef.current.clientHeight;
        
        // Calculate scale needed to fit the graph in both dimensions
        const scaleX = containerWidth / viewBoxWidth;
        const scaleY = containerHeight / viewBoxHeight;
        
        // Use the smaller scale to ensure the entire graph fits
        const initialZoom = Math.min(scaleX, scaleY) * 0.9; // 0.9 to add some padding
        setZoom(initialZoom);
        
        // Center the graph
        setPan({
          x: (containerWidth - viewBoxWidth * initialZoom) / 2,
          y: (containerHeight - viewBoxHeight * initialZoom) / 2
        });
      }
    };

    // Call immediately
    updateGraphPosition();

    // Set up a resize observer to handle window/container size changes
    const resizeObserver = new ResizeObserver(updateGraphPosition);
    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [viewBoxWidth, viewBoxHeight]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(Math.max(z * delta, 0.1), 3));
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) { // Left click only
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

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoom(z => Math.min(z * 1.2, 3));
  };

  const zoomOut = () => {
    setZoom(z => Math.max(z * 0.8, 0.1));
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized':
        return '🟢';
      case 'slight-delay':
        return '🟡';
      case 'inefficient':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const filteredSessions = mockSessions.filter(session =>
    session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.agent?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
  };

  const getNodeColor = (nodeId: string) => {
    if (hoveredNode === nodeId) return 'rgb(79, 70, 229)';
    if (selectedSessions.length === 0) return 'rgb(99, 102, 241)';
    
    const isInPath = selectedSessions.some(sessionId => 
      mockSessionPaths[sessionId]?.includes(nodeId)
    );
    
    return isInPath ? 'rgb(99, 102, 241)' : 'rgb(209, 213, 219)';
  };

  const getEdgePath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const controlPoint1 = { x: start.x + (end.x - start.x) / 2, y: start.y };
    const controlPoint2 = { x: start.x + (end.x - start.x) / 2, y: end.y };
    return `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;
  };

  const getEdgeColor = (edge: WorkflowEdge) => {
    if (selectedSessions.length === 0) return 'rgb(209, 213, 219)';
    
    const isInPath = selectedSessions.some(sessionId => {
      const path = mockSessionPaths[sessionId];
      if (!path) return false;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === edge.source && path[i + 1] === edge.target) {
          return true;
        }
      }
      return false;
    });
    
    return isInPath ? 'rgb(99, 102, 241)' : 'rgb(229, 231, 235)';
  };

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId);
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
                <span>Filter by:</span>
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
      <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Workflow Visualization</h2>
              <p className="text-sm text-gray-500">
                {selectedSessions.length > 0 
                  ? `Showing path for Session ${selectedSessions.map(id => mockSessions.find(s => s.id === id)?.sessionId).join(', ')}`
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
            </div>
          </div>
          <div 
            className="relative h-[calc(100%-5rem)] border border-gray-200 rounded-lg overflow-hidden"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBoxWidth} ${viewBoxHeight}`}
              className="overflow-visible"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                {/* Render edges */}
                {mockEdges.map((edge) => {
                  const startPos = nodePositions[edge.source];
                  const endPos = nodePositions[edge.target];
                  return (
                    <g key={`${edge.source}-${edge.target}`}>
                      <path
                        d={getEdgePath(startPos, endPos)}
                        stroke={getEdgeColor(edge)}
                        strokeWidth={2}
                        fill="none"
                        className="transition-colors duration-300"
                      />
                      {/* Edge frequency indicator */}
                      <circle
                        cx={(startPos.x + endPos.x) / 2}
                        cy={(startPos.y + endPos.y) / 2}
                        r={4}
                        fill={getEdgeColor(edge)}
                        className="transition-colors duration-300"
                      />
                    </g>
                  );
                })}
                
                {/* Render nodes */}
                {mockNodes.map((node) => {
                  const pos = nodePositions[node.id];
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x},${pos.y})`}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => handleNodeHover(node.id)}
                      onMouseLeave={() => handleNodeHover(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        r={20}
                        fill={getNodeColor(node.id)}
                        className="transition-colors duration-300"
                      />
                      <text
                        textAnchor="middle"
                        dy=".3em"
                        fill="white"
                        fontSize={10}
                        className="pointer-events-none"
                      >
                        {node.label.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {selectedNode && <AiInsightsPanel />}
    </div>
  );
}

export default WorkflowGraph; 