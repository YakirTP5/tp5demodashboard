import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Wand2, 
  Users, 
  Cable, 
  ShieldCheck, 
  Settings, 
  GitGraph 
} from 'lucide-react';
import TopSection from './components/TopSection';
import MainSection from './components/MainSection';
import { AppProvider } from './context/AppContext';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: LineChart, label: 'Analytics' },
  { icon: Wand2, label: 'AI Insights' },
  { icon: Users, label: 'Teams' },
  { icon: Cable, label: 'Integrations' },
  { icon: ShieldCheck, label: 'Security' },
  { icon: Settings, label: 'Settings' }
];

const SidebarItem: React.FC<{
  icon: React.ElementType;
  label: string;
  active?: boolean;
}> = ({ icon: Icon, label, active }) => (
  <button
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
      active 
        ? 'bg-gray-800 text-white' 
        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-gray-950">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 p-4">
          <div className="flex items-center space-x-2 px-2 mb-8">
            <GitGraph className="h-8 w-8 text-cyan-500" />
            <span className="text-lg font-bold text-white">Tier.5</span>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem 
                key={index}
                icon={item.icon}
                label={item.label}
                active={item.active}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <TopSection />
          <MainSection />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;