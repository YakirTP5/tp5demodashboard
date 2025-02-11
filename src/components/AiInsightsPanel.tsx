import React, { useState } from 'react';
import { X, MessageSquare, Lightbulb, TrendingUp } from 'lucide-react';

const AiInsightsPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const insights = [
    {
      type: 'optimization',
      icon: TrendingUp,
      title: 'Workflow Optimization',
      description: 'High inefficiency detected in the Log Analysis step. Consider implementing automated log parsing.',
      impact: 'Could reduce processing time by 45%'
    },
    {
      type: 'suggestion',
      icon: Lightbulb,
      title: 'Process Improvement',
      description: 'Multiple iterations detected in the Code Review phase. AI-powered code analysis could streamline this.',
      impact: 'Potential 30% reduction in review cycles'
    },
    {
      type: 'alert',
      icon: MessageSquare,
      title: 'Bottleneck Alert',
      description: 'Documentation step is causing delays in 60% of workflows.',
      impact: 'Affects overall completion time by +25%'
    }
  ];

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-indigo-500 text-white p-2 rounded-l-lg shadow-lg"
      >
        <Lightbulb className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Lightbulb className="h-5 w-5 text-indigo-500 mr-2" />
            AI Insights
          </h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-4rem)]">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <insight.icon className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{insight.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{insight.description}</p>
                <p className="mt-2 text-sm font-medium text-indigo-600">
                  Impact: {insight.impact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiInsightsPanel; 