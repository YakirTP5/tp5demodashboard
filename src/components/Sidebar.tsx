import React from 'react';
import { LayoutDashboard, LineChart, Wand2, Users, Cable, ShieldCheck, Settings, GitGraph } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'analysis' | 'workflow';
  onViewChange: (view: 'dashboard' | 'analysis' | 'workflow') => void;
  onCopilotToggle: () => void;
  showCopilot: boolean;
}

function Sidebar({ currentView, onViewChange, onCopilotToggle, showCopilot }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">TP5 Dashboard</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onViewChange('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewChange('analysis')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'analysis' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LineChart className="h-5 w-5" />
              <span>Task Analysis</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewChange('workflow')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'workflow' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <GitGraph className="h-5 w-5" />
              <span>Workflow Graph</span>
            </button>
          </li>
          <li>
            <button 
              onClick={onCopilotToggle}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                showCopilot 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Wand2 className="h-5 w-5" />
              <span>AI Assistant</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
              <Users className="h-5 w-5" />
              <span>Team</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
              <Cable className="h-5 w-5" />
              <span>Integrations</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
              <ShieldCheck className="h-5 w-5" />
              <span>Security</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;