import React from 'react';
import {
  LayoutDashboard,
  PiggyBank,
  Landmark,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  currentTab?: string;
  activeTab?: string;
  onSelectTab: (tab: string) => void;
  onOpenAskFinWise: () => void;
  onSignOut?: () => void;
  userName?: string;
  healthScore?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  onOpenAskFinWise,
  onSignOut,
  userName = 'Aarav Sharma',
}) => {
  const selected = activeTab || currentTab || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'save', label: 'Save', icon: PiggyBank, badge: 'Save ₹4.5k' },
    { id: 'borrow', label: 'Borrow', icon: Landmark },
    { id: 'grow', label: 'Grow', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target, badge: '3 Active' },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-64 lg:w-68 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 z-30"
    >
      {/* Brand Header */}
      <div className="p-6 pb-5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#1A1F2C] tracking-tight text-lg">FinWise</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                AI
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Personal Financial Coach</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Core Focus
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selected === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 shadow-xs'
                  : 'text-gray-600 hover:text-[#1A1F2C] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Quick Callout Card */}
        <div className="pt-4 px-2">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FinWise Coach</span>
            </div>
            <p className="text-xs text-gray-600 leading-snug mb-2.5">
              Have a question about loans, targets or savings?
            </p>
            <button
              type="button"
              id="sidebar-ask-finwise-btn"
              onClick={onOpenAskFinWise}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask FinWise ✨</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary / Footer Navigation */}
      <div className="p-4 border-t border-gray-200 space-y-1 bg-gray-50/50">
        <button
          type="button"
          id="nav-settings"
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
            selected === 'settings'
              ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A1F2C]'
          }`}
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Profile & Settings</span>
        </button>

        <div className="pt-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1A1F2C] text-white flex items-center justify-center text-xs font-bold">
              {userName.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-[#1A1F2C] leading-tight">{userName}</p>
              <p className="text-[10px] text-gray-400">Demo Profile</p>
            </div>
          </div>
          {onSignOut && (
            <button
              type="button"
              id="nav-sign-out"
              onClick={onSignOut}
              title="Return to Landing Page"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
