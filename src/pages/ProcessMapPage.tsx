import React from 'react';
import ProcessMap from '../components/ProcessMap';
import { mockProcessData } from '../data/mockProcessData';

const ProcessMapPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold">Process Map</h1>
        <p className="text-gray-600">Select a session to highlight its path through the process</p>
      </div>
      <div className="flex-1">
        <ProcessMap data={mockProcessData} />
      </div>
    </div>
  );
};

export default ProcessMapPage; 