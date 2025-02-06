import React, { useState } from 'react';
import { 
  Clock, DollarSign, Zap, Play, ChevronRight, 
  ChevronDown, Video, BarChart2, CheckCircle, XCircle 
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'efficient' | 'inefficient' | 'neutral';
  manualTime: number;
  aiAssistedTime: number;
  description: string;
  videoTimestamp?: number;
}

const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: '1',
    name: 'Log Inspection',
    status: 'inefficient',
    manualTime: 150,
    aiAssistedTime: 45,
    description: 'Auto-parsed by AI for quick anomaly detection',
    videoTimestamp: 123
  },
  {
    id: '2',
    name: 'Wiki Lookup',
    status: 'inefficient',
    manualTime: 180,
    aiAssistedTime: 5,
    description: 'Instant AI knowledge retrieval',
    videoTimestamp: 245
  },
  {
    id: '3',
    name: 'Solution Implementation',
    status: 'efficient',
    manualTime: 300,
    aiAssistedTime: 180,
    description: 'AI-assisted code implementation',
    videoTimestamp: 389
  }
];

function TaskAnalysis() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateSavings = (manual: number, assisted: number): number => {
    return Math.round(((manual - assisted) / manual) * 100);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'efficient':
        return 'bg-green-500';
      case 'inefficient':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleVideoPlay = (timestamp: number) => {
    console.log(`Playing video at timestamp: ${timestamp}`);
    setIsVideoExpanded(true);
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Task Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Customer Support Workflow Optimization</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">45.5h</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Cost</p>
                <p className="font-medium">$2,275.00</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Efficiency Score</p>
                <p className="font-medium">65%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Visualization */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Workflow Steps</h3>
          <div className="space-y-4">
            {mockWorkflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {index !== mockWorkflowSteps.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full ${getStatusColor(step.status)} flex items-center justify-center text-white shrink-0`}>
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{step.name}</h4>
                        <button
                          onClick={() => handleVideoPlay(step.videoTimestamp!)}
                          className="text-indigo-600 hover:text-indigo-500 flex items-center"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Watch
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Manual vs. AI-Assisted Comparison</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Step
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manual Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI-Assisted Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Saved
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockWorkflowSteps.map((step) => (
                <tr key={step.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {step.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(step.manualTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(step.aiAssistedTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {calculateSavings(step.manualTime, step.aiAssistedTime)}% ⚡
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Panel (Collapsible) */}
      <div className={`bg-gray-800 transition-all duration-300 ${isVideoExpanded ? 'w-96' : 'w-0'}`}>
        {isVideoExpanded && (
          <div className="p-4 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Session Recording</h3>
              <button
                onClick={() => setIsVideoExpanded(false)}
                className="text-gray-400 hover:text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg mb-4">
              {/* Video player would go here */}
              <div className="w-full h-full flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-600" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Current Step:</p>
              <p className="font-medium">Log Analysis</p>
              <p className="text-sm text-gray-400 mt-2">Timestamp: 2:45</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskAnalysis; 