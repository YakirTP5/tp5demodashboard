import React, { useState } from 'react';
import { LayoutDashboard, LineChart, Wand2, Users, Cable, ShieldCheck, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopSection from './components/TopSection';
import MainSection from './components/MainSection';
import TaskAnalysis from './components/TaskAnalysis';
import AiInsightsPanel from './components/AiInsightsPanel';
import { AppProvider } from './context/AppContext';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'analysis'>('dashboard');

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onViewChange={setCurrentView} currentView={currentView} />
        <main className="flex-1 overflow-auto">
          {currentView === 'dashboard' ? (
            <div className="container mx-auto px-6 py-8">
              <TopSection />
              <MainSection />
            </div>
          ) : (
            <TaskAnalysis />
          )}
        </main>
        <AiInsightsPanel />
      </div>
    </AppProvider>
  );
}

export default App;