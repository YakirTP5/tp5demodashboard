export interface Session {
  id: string;
  sessionId: string;
  duration: number;
  inefficiencyScore: number;
  agent: string;
  status: 'optimized' | 'slight-delay' | 'inefficient';
  workflowId: string;
  timestamp: string;
  category?: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'start' | 'end' | 'task' | 'decision' | 'validation';
  timeSpent: number;
  aiRecommendation?: string;
  efficiency: 'fast' | 'moderate' | 'slow';
  videoTimestamp?: number;
  position: {
    x: number;
    y: number;
  };
}

export interface WorkflowEdge {
  source: string;
  target: string;
  frequency: number;
  efficiency: 'optimal' | 'suboptimal' | 'inefficient';
  sessionCount: number;
}

export interface WorkflowPath {
  sessionId: string;
  nodes: string[];
  duration: number;
  timestamp: string;
}

export interface WorkflowMetrics {
  totalSessions: number;
  averageDuration: number;
  inefficientPaths: number;
  commonBottlenecks: string[];
  optimizationScore: number;
} 