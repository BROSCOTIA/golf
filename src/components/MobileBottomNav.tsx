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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
