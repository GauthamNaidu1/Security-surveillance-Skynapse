import React from 'react';
import { LayoutDashboard, Activity, BrainCircuit, Cctv, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'live', label: 'Live Monitor', icon: Activity },
    { id: 'analytics', label: 'Crime Analytics', icon: LayoutDashboard },
    { id: 'predictor', label: 'AI Predictor', icon: BrainCircuit },
    { id: 'surveillance', label: 'Crime Detection', icon: Cctv },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <ShieldAlert className="w-8 h-8 text-red-600" />
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-wider">SKYNAPSE</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Hyderabad Grid</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${activeTab === item.id
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent border-l-2 border-red-600"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className={`w-5 h-5 relative z-10 ${activeTab === item.id ? 'text-red-500' : ''}`} />
            <span className="relative z-10 font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">System Status</span>
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <div className="text-xs font-mono text-green-500">ONLINE • SECURE</div>
        </div>
      </div>
    </div>
  );
}
