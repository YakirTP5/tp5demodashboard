import React, { useState, useRef } from 'react';
import { 
  Bot, X, Maximize2, Minimize2, Search, BookOpen, 
  MessageSquare, AlertTriangle, Play, Grip, RefreshCw 
} from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
}

interface WikiSuggestion {
  title: string;
  relevance: number;
  snippet: string;
  url: string;
}

interface CopilotState {
  activeTab: 'logs' | 'wiki' | 'response' | 'alerts' | 'replay';
  isMinimized: boolean;
  position: { x: number; y: number };
}

const mockLogs: LogEntry[] = [
  {
    timestamp: '10:45:23',
    level: 'error',
    message: 'Connection timeout in authentication service'
  },
  {
    timestamp: '10:45:25',
    level: 'warning',
    message: 'Retry attempt 1/3 for user session validation'
  },
  {
    timestamp: '10:45:30',
    level: 'info',
    message: 'Successfully reconnected to auth service'
  }
];

const mockWikiSuggestions: WikiSuggestion[] = [
  {
    title: 'Auth Service Troubleshooting',
    relevance: 95,
    snippet: 'Common timeout issues and resolution steps...',
    url: '#'
  },
  {
    title: 'Session Management Guide',
    relevance: 82,
    snippet: 'Best practices for handling session validation...',
    url: '#'
  }
];

const mockTicketResponse = `Dear [Customer],

I understand you're experiencing issues with the authentication service. Our system detected a temporary connection timeout, which has been resolved. Here's what happened:

1. A brief connectivity issue occurred at 10:45:23
2. Our auto-retry mechanism successfully restored the connection
3. Your session is now fully operational

To prevent this in the future, we've:
- Increased the connection timeout threshold
- Added additional monitoring for the auth service

Please let me know if you experience any further issues.

Best regards,
[Agent Name]`;

function AiCopilot() {
  const [state, setState] = useState<CopilotState>({
    activeTab: 'logs',
    isMinimized: false,
    position: { x: 20, y: 20 }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setState(prev => ({
        ...prev,
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleMinimize = () => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const renderTabContent = () => {
    switch (state.activeTab) {
      case 'logs':
        return (
          <div className="space-y-3">
            {mockLogs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  log.level === 'error' ? 'bg-red-50 text-red-700' :
                  log.level === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                <span className="font-mono">{log.timestamp}</span>
                <p className="mt-1">{log.message}</p>
              </div>
            ))}
          </div>
        );
      case 'wiki':
        return (
          <div className="space-y-4">
            {mockWikiSuggestions.map((suggestion, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {suggestion.relevance}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{suggestion.snippet}</p>
                <a href={suggestion.url} className="text-indigo-600 text-sm hover:text-indigo-500 mt-2 inline-block">
                  Read more →
                </a>
              </div>
            ))}
          </div>
        );
      case 'response':
        return (
          <div>
            <textarea
              className="w-full h-64 p-3 text-sm border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue={mockTicketResponse}
            />
            <div className="flex justify-end mt-3 space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Regenerate
              </button>
              <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Send Response
              </button>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="space-y-3">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Excessive Tool Switching</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Detected frequent switches between Jira and Wiki. Consider using the integrated search.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
              <div className="flex items-start">
                <RefreshCw className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Process Optimization</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    AI can automate the log analysis step. Click to enable automation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'replay':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <Play className="h-12 w-12 text-white opacity-50" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Optimized Workflow</h4>
              <p className="text-sm text-gray-600">
                Watch how AI would handle this ticket using automated log analysis and smart response generation.
              </p>
              <button className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Apply AI Workflow
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        left: state.position.x,
        top: state.position.y,
        zIndex: 50,
      }}
      className={`${state.isMinimized ? 'w-auto' : 'w-96'} bg-white rounded-lg shadow-lg transition-all duration-200`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-indigo-600 text-white rounded-t-lg cursor-move">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className={`font-medium ${state.isMinimized ? 'hidden' : ''}`}>AI Copilot</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleMinimize}>
            {state.isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      {!state.isMinimized && (
        <>
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setState(prev => ({ ...prev, activeTab: 'logs' }))}
              className={`flex items-center space-x-1 px-4 py-2 text-sm ${
                state.activeTab === 'logs' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Logs</span>
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, activeTab: 'wiki' }))}
              className={`flex items-center space-x-1 px-4 py-2 text-sm ${
                state.activeTab === 'wiki' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Wiki</span>
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, activeTab: 'response' }))}
              className={`flex items-center space-x-1 px-4 py-2 text-sm ${
                state.activeTab === 'response' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Response</span>
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, activeTab: 'alerts' }))}
              className={`flex items-center space-x-1 px-4 py-2 text-sm ${
                state.activeTab === 'alerts' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Alerts</span>
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, activeTab: 'replay' }))}
              className={`flex items-center space-x-1 px-4 py-2 text-sm ${
                state.activeTab === 'replay' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <Play className="h-4 w-4" />
              <span>Replay</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {renderTabContent()}
          </div>
        </>
      )}
    </div>
  );
}

export default AiCopilot; 