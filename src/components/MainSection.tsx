import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Clock, Users as UsersIcon, Zap, PenTool as Tool, AlertTriangle, TrendingUp, TrendingDown, DollarSign, CheckCircle2, Circle, XCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

function MainSection() {
  const { tasks, workflows, sessions, loading, error } = useApp();
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [expandedWorkflows, setExpandedWorkflows] = useState<string[]>([]);

  useEffect(() => {
    console.log('MainSection - Current State:', {
      tasksCount: tasks.length,
      workflowsCount: workflows.length,
      sessionsCount: sessions.length,
      expandedTasks,
      expandedWorkflows,
      loading,
      error
    });
  }, [tasks, workflows, sessions, expandedTasks, expandedWorkflows, loading, error]);

  const toggleTask = (taskId: string) => {
    console.log(`🔄 Toggling task ${taskId}`);
    setExpandedTasks(prev => {
      const newState = prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];
      console.log('New expanded tasks state:', newState);
      return newState;
    });
  };

  const toggleWorkflow = (workflowId: string) => {
    console.log(`🔄 Toggling workflow ${workflowId}`);
    setExpandedWorkflows(prev => {
      const newState = prev.includes(workflowId)
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId];
      console.log('New expanded workflows state:', newState);
      return newState;
    });
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <Circle className="h-4 w-4 text-gray-400" />;
    
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in progress':
        return <Circle className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderTaskMetrics = (task: any) => (
    <div className="grid grid-cols-4 gap-4 items-center">
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1.5" />
        {task.totalTimeSpent.toFixed(1)}h
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <DollarSign className="h-4 w-4 mr-1" />
        ${task.opsCost.toFixed(2)}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Zap className="h-4 w-4 mr-1" />
        {task.automationScore.toFixed(1)}%
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
        {task.blunderTime.toFixed(1)}h (${task.blunderCost.toFixed(2)})
      </div>
    </div>
  );

  const renderWorkflowMetrics = (workflow: any) => (
    <div className="grid grid-cols-4 gap-4 items-center">
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1.5" />
        {workflow.timeSpent.toFixed(1)}h
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <DollarSign className="h-4 w-4 mr-1" />
        ${workflow.cost.toFixed(2)}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        {getStatusIcon(workflow.status)}
        <span className="ml-1">{workflow.status || 'Unknown'}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1.5" />
        Last updated: {workflow.lastUpdated ? new Date(workflow.lastUpdated).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  );

  const renderSessionMetrics = (session: any) => (
    <div className="grid grid-cols-4 gap-4 items-center">
      <div className="flex items-center text-sm text-gray-500">
        <UsersIcon className="h-4 w-4 mr-1.5" />
        {session.agent}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1.5" />
        {session.timeSpent.toFixed(1)}h
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <DollarSign className="h-4 w-4 mr-1" />
        ${session.cost.toFixed(2)}
      </div>
      <div className="flex flex-wrap gap-1">
        {session.toolsUsed.map((tool: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-lg text-gray-600">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 flex items-center justify-center h-64">
        <div className="text-red-500">
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Task & Workflow Overview</h2>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No tasks available</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="bg-white shadow rounded-lg overflow-hidden">
            {/* Task Level */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {expandedTasks.includes(task.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  <div className="ml-2">
                    <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Task ID: {task.taskId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {workflows.filter(w => w.taskId === task.taskId).length} workflows
                  </span>
                </div>
              </div>
              {renderTaskMetrics(task)}
            </div>

            {/* Workflow Level */}
            {expandedTasks.includes(task.id) && (
              <div className="mt-2">
                {workflows
                  .filter((wf) => wf.taskId === task.taskId)
                  .map((workflow) => (
                    <div key={workflow.id} className="mx-4 mb-4">
                      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleWorkflow(workflow.id)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                {expandedWorkflows.includes(workflow.id) ? (
                                  <ChevronDown className="h-5 w-5" />
                                ) : (
                                  <ChevronRight className="h-5 w-5" />
                                )}
                              </button>
                              <div className="ml-2">
                                <h4 className="text-md font-medium text-gray-700">{workflow.name}</h4>
                                <p className="text-sm text-gray-500">Workflow ID: {workflow.workflowId}</p>
                              </div>
                            </div>
                          </div>
                          {renderWorkflowMetrics(workflow)}
                        </div>

                        {/* Sessions Level */}
                        {expandedWorkflows.includes(workflow.id) && (
                          <div className="border-t border-gray-200">
                            {sessions
                              .filter((sess) => sess.workflowId === workflow.workflowId)
                              .map((session) => (
                                <div key={session.id} className="p-4 bg-white border-b border-gray-100 last:border-b-0">
                                  <div className="mb-2">
                                    <h5 className="text-sm font-medium text-gray-700">Session {session.sessionId}</h5>
                                  </div>
                                  {renderSessionMetrics(session)}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MainSection;