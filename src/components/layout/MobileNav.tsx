import React from 'react';
import {
  LayoutDashboard,
  PiggyBank,
  Landmark,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
} from 'lucide-react';

interface MobileNavProps {
  currentTab?: string;
  activeTab?: string;
  onSelectTab: (tab: string) => void;
  onOpenAskFinWise?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
}) => {
  const selected = activeTab || currentTab || 'dashboard';

  const primaryTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'save', label: 'Save', icon: PiggyBank },
    { id: 'borrow', label: 'Borrow', icon: Landmark },
    { id: 'grow', label: 'Grow', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-1 py-1.5 flex items-center justify-around shadow-sm"
    >
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = selected === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            id={`mobile-nav-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
              isActive ? 'text-indigo-600 font-semibold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
            <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
