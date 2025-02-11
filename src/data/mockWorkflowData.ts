import { Session, WorkflowNode, WorkflowEdge } from '../types/workflow';

export const mockSessions: Session[] = [
  {
    id: '1',
    sessionId: 'S-001',
    duration: 765,
    inefficiencyScore: 3.2,
    agent: 'John Doe',
    status: 'inefficient',
    workflowId: 'WF-001',
    timestamp: '2024-02-11T14:30:00Z'
  },
  {
    id: '2',
    sessionId: 'S-002',
    duration: 450,
    inefficiencyScore: 1.5,
    agent: 'Jane Smith',
    status: 'slight-delay',
    workflowId: 'WF-001',
    timestamp: '2024-02-11T15:45:00Z'
  },
  {
    id: '3',
    sessionId: 'S-003',
    duration: 380,
    inefficiencyScore: 0.8,
    agent: 'Mike Johnson',
    status: 'optimized',
    workflowId: 'WF-001',
    timestamp: '2024-02-11T16:20:00Z'
  }
];

export const mockNodes: WorkflowNode[] = [
  {
    id: 'n1',
    label: 'Ticket Created',
    type: 'start',
    timeSpent: 60,
    aiRecommendation: 'Auto-categorize tickets using NLP',
    efficiency: 'moderate',
    videoTimestamp: 0,
    position: { x: 400, y: 100 }
  },
  {
    id: 'n2',
    label: 'Initial Triage',
    type: 'decision',
    timeSpent: 180,
    aiRecommendation: 'Use AI to assess priority',
    efficiency: 'slow',
    videoTimestamp: 60,
    position: { x: 400, y: 200 }
  },
  {
    id: 'n3',
    label: 'Log Analysis',
    type: 'task',
    timeSpent: 240,
    aiRecommendation: 'AI Copilot auto-fetch',
    efficiency: 'slow',
    videoTimestamp: 240,
    position: { x: 200, y: 300 }
  },
  {
    id: 'n4',
    label: 'Error Check',
    type: 'validation',
    timeSpent: 120,
    aiRecommendation: 'Pattern recognition',
    efficiency: 'moderate',
    videoTimestamp: 480,
    position: { x: 200, y: 400 }
  },
  {
    id: 'n5',
    label: 'Wiki Search',
    type: 'task',
    timeSpent: 300,
    aiRecommendation: 'Smart KB integration',
    efficiency: 'slow',
    videoTimestamp: 600,
    position: { x: 400, y: 400 }
  },
  {
    id: 'n6',
    label: 'Code Review',
    type: 'task',
    timeSpent: 420,
    aiRecommendation: 'AI code analysis',
    efficiency: 'moderate',
    videoTimestamp: 900,
    position: { x: 600, y: 400 }
  },
  {
    id: 'n7',
    label: 'Solution Dev',
    type: 'task',
    timeSpent: 600,
    aiRecommendation: 'AI code generation',
    efficiency: 'moderate',
    videoTimestamp: 1320,
    position: { x: 200, y: 500 }
  },
  {
    id: 'n8',
    label: 'Quick Fix',
    type: 'task',
    timeSpent: 180,
    aiRecommendation: 'Auto fix suggestions',
    efficiency: 'fast',
    videoTimestamp: 1500,
    position: { x: 400, y: 500 }
  },
  {
    id: 'n9',
    label: 'Testing',
    type: 'validation',
    timeSpent: 240,
    aiRecommendation: 'Auto test generation',
    efficiency: 'moderate',
    videoTimestamp: 1740,
    position: { x: 600, y: 500 }
  },
  {
    id: 'n10',
    label: 'Documentation',
    type: 'task',
    timeSpent: 180,
    aiRecommendation: 'AI doc generation',
    efficiency: 'moderate',
    videoTimestamp: 1920,
    position: { x: 400, y: 600 }
  },
  {
    id: 'n11',
    label: 'Response',
    type: 'end',
    timeSpent: 120,
    aiRecommendation: 'Smart templates',
    efficiency: 'fast',
    videoTimestamp: 2040,
    position: { x: 400, y: 700 }
  }
];

export const mockEdges: WorkflowEdge[] = [
  // Main path
  {
    source: 'n1',
    target: 'n2',
    frequency: 1.0,
    efficiency: 'optimal',
    sessionCount: 3
  },
  // Complex issue path
  {
    source: 'n2',
    target: 'n3',
    frequency: 0.7,
    efficiency: 'suboptimal',
    sessionCount: 2
  },
  {
    source: 'n3',
    target: 'n4',
    frequency: 0.7,
    efficiency: 'suboptimal',
    sessionCount: 2
  },
  {
    source: 'n4',
    target: 'n5',
    frequency: 0.5,
    efficiency: 'inefficient',
    sessionCount: 1
  },
  {
    source: 'n5',
    target: 'n6',
    frequency: 0.4,
    efficiency: 'inefficient',
    sessionCount: 1
  },
  {
    source: 'n6',
    target: 'n7',
    frequency: 0.4,
    efficiency: 'suboptimal',
    sessionCount: 1
  },
  {
    source: 'n7',
    target: 'n9',
    frequency: 0.4,
    efficiency: 'optimal',
    sessionCount: 1
  },
  // Quick fix path
  {
    source: 'n2',
    target: 'n8',
    frequency: 0.3,
    efficiency: 'optimal',
    sessionCount: 1
  },
  {
    source: 'n8',
    target: 'n9',
    frequency: 0.3,
    efficiency: 'optimal',
    sessionCount: 1
  },
  // Documentation and response
  {
    source: 'n9',
    target: 'n10',
    frequency: 0.7,
    efficiency: 'optimal',
    sessionCount: 2
  },
  {
    source: 'n10',
    target: 'n11',
    frequency: 0.7,
    efficiency: 'optimal',
    sessionCount: 2
  },
  // Direct paths
  {
    source: 'n4',
    target: 'n8',
    frequency: 0.2,
    efficiency: 'optimal',
    sessionCount: 1
  },
  {
    source: 'n5',
    target: 'n11',
    frequency: 0.1,
    efficiency: 'optimal',
    sessionCount: 1
  }
]; 