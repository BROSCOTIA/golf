import React from 'react';
import { Users, Store, BarChart3, Upload } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'contacts' | 'stores' | 'stats' | 'import';
  onTabChange: (tab: 'contacts' | 'stores' | 'stats' | 'import') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'stores', icon: Store, label: 'Stores' },
    { id: 'stats', icon: BarChart3, label: 'Analytics' },
    { id: 'import', icon: Upload, label: 'Import' },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe z-50 shadow-lg no-print">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors cursor-pointer ${
                isActive ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700 scale-110' : ''} transition-transform`} />
              <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
