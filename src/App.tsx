import React, { useState } from 'react';
import { LayoutDashboard, LineChart, Wand2, Users, Cable, ShieldCheck, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopSection from './components/TopSection';
import MainSection from './components/MainSection';
import TaskAnalysis from './components/TaskAnalysis';
import AiInsightsPanel from './components/AiInsightsPanel';
import AiCopilot from './components/AiCopilot';
import WorkflowGraph from './components/WorkflowGraph';
import { AppProvider } from './context/AppContext';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'analysis' | 'workflow'>('dashboard');
  const [showCopilot, setShowCopilot] = useState(false);

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-[#1a1f2b]">
        <Sidebar 
          onViewChange={setCurrentView} 
          currentView={currentView}
          onCopilotToggle={() => setShowCopilot(prev => !prev)}
          showCopilot={showCopilot}
        />
        <main className="flex-1 ml-64">
          <div className="min-h-screen bg-gray-50/95">
            {currentView === 'dashboard' ? (
              <div className="container mx-auto px-6 py-8">
                <TopSection />
                <MainSection />
              </div>
            ) : currentView === 'analysis' ? (
              <TaskAnalysis />
            ) : (
              <WorkflowGraph />
            )}
          </div>
        </main>
        <AiInsightsPanel />
        {showCopilot && <AiCopilot />}
      </div>
    </AppProvider>
  );
}

export default App;