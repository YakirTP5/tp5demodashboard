export interface ProcessNode {
  id: string;
  label: string;
  type: 'action' | 'decision' | 'start' | 'end';
}

export interface ProcessEdge {
  source: string;
  target: string;
  id: string;
}

export interface ProcessSession {
  id: string;
  timestamp: string;
  path: string[]; // Array of node IDs representing the path taken
  userId: string;
}

export interface ProcessMapData {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  sessions: ProcessSession[];
} 