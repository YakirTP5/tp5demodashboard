import { ProcessMapData } from '../types/processMap';

export const mockProcessData: ProcessMapData = {
  nodes: [
    { id: 'start', label: 'New Case', type: 'start' },
    { id: 'initial_review', label: 'Initial Review', type: 'action' },
    { id: 'priority_check', label: 'Priority Level?', type: 'decision' },
    
    // High priority path
    { id: 'high_priority', label: 'High Priority Process', type: 'action' },
    { id: 'urgent_review', label: 'Urgent Review', type: 'action' },
    { id: 'escalate', label: 'Escalate to Manager', type: 'action' },
    
    // Medium priority path
    { id: 'medium_priority', label: 'Standard Process', type: 'action' },
    { id: 'assign_team', label: 'Assign Team', type: 'action' },
    
    // Low priority path
    { id: 'low_priority', label: 'Basic Process', type: 'action' },
    { id: 'auto_process', label: 'Automated Processing', type: 'action' },
    
    // Common validation points
    { id: 'validation', label: 'Validate Data', type: 'action' },
    { id: 'validation_check', label: 'Data Valid?', type: 'decision' },
    { id: 'fix_data', label: 'Fix Data Issues', type: 'action' },
    
    // Review cycle
    { id: 'review_cycle', label: 'Review Required?', type: 'decision' },
    { id: 'peer_review', label: 'Peer Review', type: 'action' },
    { id: 'supervisor_review', label: 'Supervisor Review', type: 'action' },
    { id: 'review_decision', label: 'Approve Review?', type: 'decision' },
    
    // Resolution paths
    { id: 'resolve_case', label: 'Resolve Case', type: 'action' },
    { id: 'quality_check', label: 'Quality Check', type: 'decision' },
    { id: 'rework', label: 'Rework Required', type: 'action' },
    { id: 'documentation', label: 'Update Documentation', type: 'action' },
    { id: 'final_review', label: 'Final Review', type: 'action' },
    { id: 'end', label: 'Case Closed', type: 'end' }
  ],
  edges: [
    // Initial flow
    { id: 'e1', source: 'start', target: 'initial_review' },
    { id: 'e2', source: 'initial_review', target: 'priority_check' },
    
    // Priority branches
    { id: 'e3', source: 'priority_check', target: 'high_priority' },
    { id: 'e4', source: 'priority_check', target: 'medium_priority' },
    { id: 'e5', source: 'priority_check', target: 'low_priority' },
    
    // High priority path
    { id: 'e6', source: 'high_priority', target: 'urgent_review' },
    { id: 'e7', source: 'urgent_review', target: 'escalate' },
    { id: 'e8', source: 'escalate', target: 'validation' },
    
    // Medium priority path
    { id: 'e9', source: 'medium_priority', target: 'assign_team' },
    { id: 'e10', source: 'assign_team', target: 'validation' },
    
    // Low priority path
    { id: 'e11', source: 'low_priority', target: 'auto_process' },
    { id: 'e12', source: 'auto_process', target: 'validation' },
    
    // Validation cycle
    { id: 'e13', source: 'validation', target: 'validation_check' },
    { id: 'e14', source: 'validation_check', target: 'fix_data' },
    { id: 'e15', source: 'fix_data', target: 'validation' },
    { id: 'e16', source: 'validation_check', target: 'review_cycle' },
    
    // Review process
    { id: 'e17', source: 'review_cycle', target: 'peer_review' },
    { id: 'e18', source: 'review_cycle', target: 'resolve_case' },
    { id: 'e19', source: 'peer_review', target: 'supervisor_review' },
    { id: 'e20', source: 'supervisor_review', target: 'review_decision' },
    { id: 'e21', source: 'review_decision', target: 'resolve_case' },
    { id: 'e22', source: 'review_decision', target: 'rework' },
    { id: 'e23', source: 'rework', target: 'validation' },
    
    // Resolution path
    { id: 'e24', source: 'resolve_case', target: 'quality_check' },
    { id: 'e25', source: 'quality_check', target: 'documentation' },
    { id: 'e26', source: 'quality_check', target: 'rework' },
    { id: 'e27', source: 'documentation', target: 'final_review' },
    { id: 'e28', source: 'final_review', target: 'end' }
  ],
  sessions: [
    {
      id: 'session1',
      timestamp: '2024-03-15T10:00:00Z',
      userId: 'user1',
      path: ['start', 'initial_review', 'priority_check', 'high_priority', 'urgent_review', 'escalate', 'validation', 'validation_check', 'review_cycle', 'peer_review', 'supervisor_review', 'review_decision', 'resolve_case', 'quality_check', 'documentation', 'final_review', 'end']
    },
    {
      id: 'session2',
      timestamp: '2024-03-15T11:00:00Z',
      userId: 'user2',
      path: ['start', 'initial_review', 'priority_check', 'medium_priority', 'assign_team', 'validation', 'validation_check', 'fix_data', 'validation', 'validation_check', 'review_cycle', 'resolve_case', 'quality_check', 'documentation', 'final_review', 'end']
    },
    {
      id: 'session3',
      timestamp: '2024-03-15T12:00:00Z',
      userId: 'user3',
      path: ['start', 'initial_review', 'priority_check', 'low_priority', 'auto_process', 'validation', 'validation_check', 'review_cycle', 'resolve_case', 'quality_check', 'documentation', 'final_review', 'end']
    },
    {
      id: 'session4',
      timestamp: '2024-03-15T13:00:00Z',
      userId: 'user4',
      path: ['start', 'initial_review', 'priority_check', 'high_priority', 'urgent_review', 'escalate', 'validation', 'validation_check', 'fix_data', 'validation', 'validation_check', 'review_cycle', 'peer_review', 'supervisor_review', 'review_decision', 'rework', 'validation', 'validation_check', 'review_cycle', 'resolve_case', 'quality_check', 'documentation', 'final_review', 'end']
    },
    {
      id: 'session5',
      timestamp: '2024-03-15T14:00:00Z',
      userId: 'user5',
      path: ['start', 'initial_review', 'priority_check', 'medium_priority', 'assign_team', 'validation', 'validation_check', 'review_cycle', 'peer_review', 'supervisor_review', 'review_decision', 'resolve_case', 'quality_check', 'rework', 'validation', 'validation_check', 'review_cycle', 'resolve_case', 'quality_check', 'documentation', 'final_review', 'end']
    },
    {
      id: 'session6',
      timestamp: '2024-03-15T15:00:00Z',
      userId: 'user6',
      path: ['start', 'initial_review', 'priority_check', 'low_priority', 'auto_process', 'validation', 'validation_check', 'fix_data', 'validation', 'validation_check', 'review_cycle', 'resolve_case', 'quality_check', 'rework', 'validation', 'validation_check', 'review_cycle', 'resolve_case', 'quality_check', 'documentation', 'final_review', 'end']
    }
  ]
}; 