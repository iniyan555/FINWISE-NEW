import React from 'react';
import { Sparkles, ShieldCheck, Bell } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  userProfile: UserProfile;
  currentTab?: string;
  activeTab?: string;
  onOpenAskFinWise: () => void;
  onOpenLanding?: () => void;
  onRestartOnboarding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  currentTab,
  activeTab,
  onOpenAskFinWise,
  onOpenLanding,
}) => {
  const selectedTab = currentTab || activeTab || 'dashboard';

  const getTabTitle = () => {
    switch (selectedTab) {
      case 'save':
        return 'Save & Optimize';
      case 'borrow':
        return 'Borrow & Loan Analysis';
      case 'grow':
        return 'Grow & Invest Responsibly';
      case 'goals':
        return 'Financial Goals';
      case 'insights':
        return 'Habit Insights & Trends';
      case 'settings':
        return 'Profile & Preferences';
      default:
        return 'Overview';
    }
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between"
    >
      {/* Mobile Brand / Desktop breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#1A1F2C]">FinWise AI</span>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {onOpenLanding ? (
              <button
                type="button"
                onClick={onOpenLanding}
                className="hover:text-indigo-600 transition-colors"
              >
                FinWise
              </button>
            ) : (
              <span>FinWise</span>
            )}
            <span>/</span>
            <span className="text-gray-700 font-medium capitalize">{getTabTitle()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs border border-gray-200 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Health: {userProfile.healthScore}/100</span>
        </div>

        {/* Currency Pill */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs border border-gray-200 font-medium">
          <span className="text-gray-400">Currency:</span>
          <span className="font-semibold text-gray-800">{userProfile.currencySymbol} {userProfile.currency}</span>
        </div>

        {/* Ask FinWise ✨ Trigger */}
        <button
          type="button"
          id="header-ask-finwise-trigger"
          onClick={onOpenAskFinWise}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ask FinWise ✨</span>
        </button>

        {/* Notifications Icon (Mock) */}
        <button
          type="button"
          id="header-notifications"
          title="Notifications"
          className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#1A1F2C] text-white font-bold text-xs flex items-center justify-center">
            {userProfile.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
