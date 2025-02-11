import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LineChart, Wand2, Users, Cable, ShieldCheck, Settings, GitGraph } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'analysis' | 'workflow';
  onViewChange: (view: 'dashboard' | 'analysis' | 'workflow') => void;
  onCopilotToggle: () => void;
  showCopilot: boolean;
}

const menuItems = [
  { name: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'analysis', label: 'Task Analysis', icon: <LineChart className="h-5 w-5" /> },
  { name: 'workflow', label: 'Workflow Graph', icon: <GitGraph className="h-5 w-5" /> },
  { name: 'copilot', label: 'AI Assistant', icon: <Wand2 className="h-5 w-5" /> },
  { name: 'team', label: 'Team', icon: <Users className="h-5 w-5" /> },
  { name: 'integrations', label: 'Integrations', icon: <Cable className="h-5 w-5" /> },
  { name: 'security', label: 'Security', icon: <ShieldCheck className="h-5 w-5" /> },
  { name: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
];

function Sidebar({ currentView, onViewChange, onCopilotToggle, showCopilot }: SidebarProps) {
  const handleItemClick = (name: string) => {
    if (name === 'copilot') {
      onCopilotToggle();
    } else if (name === 'dashboard' || name === 'analysis' || name === 'workflow') {
      onViewChange(name);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-[#1a1f2b]">
      <div className="p-6">
        <Link to="/" className="flex items-center mb-8 hover:opacity-80 transition-opacity">
          <img 
            src="tp5logo.jpeg" 
            alt="Tier.5 Logo" 
            className="w-8 h-8 mr-3"
          />
          <h1 className="text-xl font-bold text-white">Tier.5</h1>
        </Link>
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleItemClick(item.name)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    (currentView === item.name || (item.name === 'copilot' && showCopilot))
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;