import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Wand2, 
  Users, 
  Cable, 
  ShieldCheck, 
  Settings,
  GitGraph,
  Send
} from 'lucide-react';
import logoImage from '../../tp5logo.jpeg';

interface SidebarProps {
  currentView: 'dashboard' | 'analysis' | 'process';
  onViewChange: (view: 'dashboard' | 'analysis' | 'process') => void;
  onCopilotToggle: () => void;
  showCopilot: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onCopilotToggle,
  showCopilot
}) => {
  const [message, setMessage] = useState('');

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      view: 'dashboard' as const,
      description: 'Overview and key metrics'
    },
    {
      icon: LineChart,
      label: 'Analysis',
      view: 'analysis' as const,
      description: 'Deep dive into metrics'
    },
    {
      icon: GitGraph,
      label: 'Workflow Map',
      view: 'process' as const,
      description: 'Interactive process visualization'
    }
  ];

  const bottomMenuItems = [
    {
      icon: Users,
      label: 'Team',
      onClick: () => console.log('Team clicked')
    },
    {
      icon: Cable,
      label: 'Integrations',
      onClick: () => console.log('Integrations clicked')
    },
    {
      icon: ShieldCheck,
      label: 'Security',
      onClick: () => console.log('Security clicked')
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => console.log('Settings clicked')
    }
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#1a1f2b] text-white p-6">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <img src={logoImage} alt="Logo" className="w-8 h-8 rounded" />
          <span className="text-xl font-semibold">Tier.5 Analytics</span>
        </div>

        {/* Main Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.view
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* AI Copilot Toggle and Chat */}
        <div className="mt-6 flex flex-col">
          <button
            onClick={onCopilotToggle}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              showCopilot ? 'bg-purple-500 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Wand2 className="h-5 w-5" />
            <span>AI Copilot</span>
          </button>

          {showCopilot && (
            <div className="mt-2 flex flex-col bg-gray-800/50 rounded-lg overflow-hidden">
              <div className="h-48 p-3 overflow-y-auto">
                {/* Chat messages would go here */}
                <div className="text-sm text-gray-300">
                  Hi! I'm your AI assistant. How can I help you today?
                </div>
              </div>
              <div className="p-2 border-t border-gray-700">
                <form 
                  className="flex items-center space-x-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Handle message send
                    setMessage('');
                  }}
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Menu */}
        <nav className="mt-auto space-y-1">
          {bottomMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;