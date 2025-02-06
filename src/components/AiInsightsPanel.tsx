import React from 'react';
import { Brain, Play, ArrowRight, BarChart2, Clock, AlertTriangle, Zap } from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'optimization' | 'warning' | 'suggestion';
  timestamp?: string;
  videoTimestamp?: number;
  potentialSavings?: {
    time?: number;
    cost?: number;
  };
}

const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Repetitive Log Checks Detected',
    description: 'AI Copilot can automate log analysis and alert on anomalies, saving 2.5 hours weekly.',
    type: 'optimization',
    timestamp: '15:23',
    videoTimestamp: 923,
    potentialSavings: {
      time: 2.5,
      cost: 125
    }
  },
  {
    id: '2',
    title: 'Manual Data Entry Inefficiency',
    description: 'Consider implementing AI-powered form filling to reduce errors and save time.',
    type: 'suggestion',
    timestamp: '32:45',
    videoTimestamp: 1965,
    potentialSavings: {
      time: 1.8,
      cost: 90
    }
  },
  {
    id: '3',
    title: 'High Error Rate in Task Execution',
    description: 'AI analysis shows 15% error rate. Implement automated validation to reduce errors.',
    type: 'warning',
    timestamp: '45:12',
    videoTimestamp: 2712,
    potentialSavings: {
      time: 3.2,
      cost: 160
    }
  }
];

function AiInsightsPanel() {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'suggestion':
        return <BarChart2 className="h-5 w-5 text-green-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleVideoReplay = (timestamp: number) => {
    console.log(`Playing video at timestamp: ${timestamp}`);
    // Implement video replay functionality
  };

  const handleCompareWorkflow = (insightId: string) => {
    console.log(`Comparing workflow for insight: ${insightId}`);
    // Implement workflow comparison functionality
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">AI Insights</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{insight.description}</p>
                
                {insight.potentialSavings && (
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{insight.potentialSavings.time}h saved</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span>${insight.potentialSavings.cost} saved</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center space-x-3">
                  {insight.videoTimestamp && (
                    <button
                      onClick={() => handleVideoReplay(insight.videoTimestamp!)}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Watch Replay
                    </button>
                  )}
                  <button
                    onClick={() => handleCompareWorkflow(insight.id)}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Compare Workflow
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiInsightsPanel; 