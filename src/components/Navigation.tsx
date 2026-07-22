import React from 'react';
import { Droplet, History, BarChart3, Trophy, Settings } from 'lucide-react';
import { ViewTab } from '../types';

interface NavigationProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Droplet },
    { id: 'history', label: 'السجل', icon: History },
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'achievements', label: 'الإنجازات', icon: Trophy },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="max-w-xl mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-cyan-100/70 dark:bg-cyan-950/60 rounded-2xl -z-10 animate-fade-in" />
              )}
              <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110 fill-cyan-500/20' : ''}`} />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
