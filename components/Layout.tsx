
import React from 'react';
import { NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { id: 'coach', label: 'AI Career Coach', icon: 'fa-user-tie' },
  { id: 'interview', label: 'Mock Interview', icon: 'fa-microphone' },
  { id: 'resume', label: 'Resume Optimizer', icon: 'fa-file-alt' },
  { id: 'wellness', label: 'Wellness & Mindset', icon: 'fa-heart' },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col fixed md:sticky top-0 h-auto md:h-screen z-50">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-rocket text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Elevate
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-indigo-600 rounded-2xl p-4 text-white text-sm">
            <p className="font-semibold mb-2">Pro Tip:</p>
            <p className="opacity-90">Keep your LinkedIn profile updated with your latest projects.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 overflow-y-auto pt-20 md:pt-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-xl font-semibold text-slate-800">
            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-indigo-600 relative">
              <i className="fas fa-bell"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://picsum.photos/seed/user/100" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
