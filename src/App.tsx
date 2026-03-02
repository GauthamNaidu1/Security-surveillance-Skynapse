/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LiveMonitor from './components/LiveMonitor';
import Analytics from './components/Analytics';
import Predictor from './components/Predictor';
import Surveillance from './components/Surveillance';

export default function App() {
  const [activeTab, setActiveTab] = useState('live');

  const renderContent = () => {
    switch (activeTab) {
      case 'live': return <LiveMonitor />;
      case 'analytics': return <Analytics />;
      case 'predictor': return <Predictor />;
      case 'surveillance': return <Surveillance />;
      default: return <LiveMonitor />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
