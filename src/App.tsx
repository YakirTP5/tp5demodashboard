import React from 'react';
import { LayoutDashboard, LineChart, Wand2, Users, Cable, ShieldCheck, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopSection from './components/TopSection';
import MainSection from './components/MainSection';
import AiInsightsPanel from './components/AiInsightsPanel';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            <TopSection />
            <MainSection />
          </div>
        </main>
        <AiInsightsPanel />
      </div>
    </AppProvider>
  );
}

export default App;