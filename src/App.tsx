import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LayoutDashboard, LineChart, Wand2, Users, Cable, ShieldCheck, Settings, GitGraph } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopSection from './components/TopSection';
import MainSection from './components/MainSection';
import TaskAnalysis from './components/TaskAnalysis';
import AiInsightsPanel from './components/AiInsightsPanel';
import ProcessMapPage from './pages/ProcessMapPage';
import { AppProvider } from './context/AppContext';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'analysis' | 'process'>('dashboard');
  const [showCopilot, setShowCopilot] = useState(false);

  return (
    <BrowserRouter>
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
                <ProcessMapPage />
              )}
            </div>
          </main>
          <AiInsightsPanel />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;