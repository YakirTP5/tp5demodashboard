import React from 'react';
import { LayoutDashboard, LineChart, Wand2, Users, Cable, ShieldCheck, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, current: true },
  { name: 'Analytics', icon: LineChart, current: false },
  { name: 'Automation Assistant', icon: Wand2, current: false },
  { name: 'Team', icon: Users, current: false },
  { name: 'Integrations', icon: Cable, current: false },
  { name: 'Admin Panel', icon: ShieldCheck, current: false },
  { name: 'Settings', icon: Settings, current: false },
];

function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Tier.5</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md
              ${
                item.current
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                item.current ? 'text-indigo-600' : 'text-gray-400'
              }`}
            />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;