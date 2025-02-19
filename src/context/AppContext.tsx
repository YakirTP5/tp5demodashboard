import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import tasksData from '../data/tasks.json';
import workflowsData from '../data/workflows.json';
import sessionsData from '../data/sessions.json';
import stepsData from '../data/steps.json';
import actionsData from '../data/actions.json';

interface AutomationBreakdown {
  manual_steps: number;
  automated_steps: number;
  potential_automation: number;
  ai_assisted_steps: number;
}

interface AutomationMetrics {
  automation_score: number;
  manual_steps: number;
  automated_steps: number;
  ai_assisted_steps: number;
}

interface APITask {
  _id: string;
  "Task ID": string;
  "Task Name": string;
  "Total Time Spent (h)": string;
  "Ops Cost ($)": string;
  "Automation Score (%)": string;
  "Blunder Time (h)": string;
  "Blunder Cost ($)": string;
  tags: string[];
  apps: string[];
  automation_breakdown: AutomationBreakdown;
}

interface Task {
  id: string;
  name: string;
  team: string;
  costPerTicket: number;
  aiSavings: number;
  resolutionTime: string;
  impact: number;
  isBottleneck?: boolean;
}

interface APIWorkflow {
  _id: string;
  "Workflow ID": string;
  "Task ID": string;
  "Workflow Name": string;
  "Time Spent (h)": string;
  "Cost ($)": string;
  "Status": string;
  "Last Updated": string;
  tags?: string[];
  apps?: string[];
  automation_metrics?: AutomationMetrics;
}

interface Workflow {
  id: string;
  workflowId: string;
  taskId: string;
  name: string;
  timeSpent: number;
  cost: number;
  status: string;
  lastUpdated: string;
  tags: string[];
  apps: string[];
  automation_metrics: AutomationMetrics;
}

interface APISession {
  _id: string;
  "Session ID": string;
  "Workflow ID": string;
  "Start Time": string;
  "End Time": string;
  "Duration (h)": string;
  "Cost ($)": string;
  tools_used: string[];
  tags: string[];
  automation_metrics: AutomationMetrics;
}

interface Session {
  id: string;
  sessionId: string;
  workflowId: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  tools_used: string[];
  tags: string[];
  automation_metrics: AutomationMetrics;
}

interface APIStep {
  _id: string;
  "Step ID": string;
  "Workflow ID": string;
  "Step Name": string;
  "Responsible": string;
  "Estimated Time (h)": string;
  "Status": string;
  "Order": number;
  "Description": string;
}

interface Step {
  id: string;
  stepId: string;
  workflowId: string;
  name: string;
  responsible: string;
  estimatedTime: number;
  status: string;
  order: number;
  description: string;
}

interface APIAction {
  _id: string;
  "Action ID": string;
  "Step ID": string;
  "Action Name": string;
  "Type": string;
  "Tool": string;
  "Status": string;
  "Order": number;
  "Duration (h)": string;
  "Description": string;
}

interface Action {
  id: string;
  actionId: string;
  stepId: string;
  name: string;
  type: string;
  tool: string;
  status: string;
  order: number;
  duration: number;
  description: string;
}

interface AppContextType {
  tasks: Task[];
  workflows: Workflow[];
  sessions: Session[];
  steps: Step[];
  actions: Action[];
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapAPITaskToTask = (apiTask: APITask): Task => ({
    id: apiTask._id,
    name: apiTask["Task Name"],
    team: '', // Assuming team is not available in the API response
    costPerTicket: parseFloat(apiTask["Ops Cost ($)"]),
    aiSavings: 0, // Assuming aiSavings is not available in the API response
    resolutionTime: apiTask["Total Time Spent (h)"],
    impact: 0, // Assuming impact is not available in the API response
  });

  const mapAPIWorkflowToWorkflow = (apiWorkflow: APIWorkflow): Workflow => ({
    id: apiWorkflow._id,
    workflowId: apiWorkflow["Workflow ID"],
    taskId: apiWorkflow["Task ID"],
    name: apiWorkflow["Workflow Name"],
    timeSpent: parseFloat(apiWorkflow["Time Spent (h)"]),
    cost: parseFloat(apiWorkflow["Cost ($)"]),
    status: apiWorkflow["Status"],
    lastUpdated: apiWorkflow["Last Updated"],
    tags: apiWorkflow.tags || [],
    apps: apiWorkflow.apps || [],
    automation_metrics: apiWorkflow.automation_metrics || {
      automation_score: 0,
      manual_steps: 0,
      automated_steps: 0,
      ai_assisted_steps: 0
    }
  });

  const mapAPISessionToSession = (apiSession: APISession): Session => ({
    id: apiSession._id,
    sessionId: apiSession["Session ID"],
    workflowId: apiSession["Workflow ID"],
    startTime: apiSession["Start Time"],
    endTime: apiSession["End Time"],
    duration: parseFloat(apiSession["Duration (h)"]),
    cost: parseFloat(apiSession["Cost ($)"]),
    tools_used: apiSession.tools_used,
    tags: apiSession.tags,
    automation_metrics: apiSession.automation_metrics
  });

  const mapAPIStepToStep = (apiStep: APIStep): Step => ({
    id: apiStep._id,
    stepId: apiStep["Step ID"],
    workflowId: apiStep["Workflow ID"],
    name: apiStep["Step Name"],
    responsible: apiStep["Responsible"],
    estimatedTime: parseFloat(apiStep["Estimated Time (h)"]),
    status: apiStep["Status"],
    order: apiStep["Order"],
    description: apiStep["Description"]
  });

  const mapAPIActionToAction = (apiAction: APIAction): Action => ({
    id: apiAction._id,
    actionId: apiAction["Action ID"],
    stepId: apiAction["Step ID"],
    name: apiAction["Action Name"],
    type: apiAction["Type"],
    tool: apiAction["Tool"],
    status: apiAction["Status"],
    order: apiAction["Order"],
    duration: parseFloat(apiAction["Duration (h)"]),
    description: apiAction["Description"]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTasks: Task[] = [
          {
            id: '1',
            name: 'Customer Support',
            team: 'Support',
            costPerTicket: 89,
            aiSavings: 34,
            resolutionTime: '2h 15m',
            impact: -15
          },
          {
            id: '2',
            name: 'Technical Support',
            team: 'Engineering',
            costPerTicket: 156,
            aiSavings: 42,
            resolutionTime: '4h 30m',
            impact: 25,
            isBottleneck: true
          },
          {
            id: '3',
            name: 'Billing Support',
            team: 'Finance',
            costPerTicket: 67,
            aiSavings: 28,
            resolutionTime: '1h 45m',
            impact: -8
          }
        ];

        setTasks(mockTasks);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ tasks, workflows, sessions, steps, actions, loading, error }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 