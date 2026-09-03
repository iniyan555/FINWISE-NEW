import React, { useState } from 'react';
import { UserProfile, Recommendation, NavigationTab } from './types';
import { initialUserProfile, defaultRecommendations } from './data/mockData';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { AskFinWiseDrawer } from './components/common/AskFinWiseDrawer';

// View modules
import { DashboardView } from './components/dashboard/DashboardView';
import { SaveView } from './components/save/SaveView';
import { BorrowView } from './components/borrow/BorrowView';
import { GrowView } from './components/grow/GrowView';
import { GoalsView } from './components/goals/GoalsView';
import { InsightsView } from './components/insights/InsightsView';

export default function App() {
  // App routing mode
  const [viewMode, setViewMode] = useState<'landing' | 'onboarding' | 'app'>('app');
  
  // Active navigation tab inside 'app' mode
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Core User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations);

  // AI Assistant Drawer state
  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState<boolean>(false);
  const [drawerQuery, setDrawerQuery] = useState<string | undefined>(undefined);

  // Handle opening Ask FinWise with optional pre-filled question
  const handleOpenAskDrawer = (query?: string) => {
    setDrawerQuery(query);
    setIsAskDrawerOpen(true);
  };

  // Switch tabs safely
  const handleNavigateTab = (tab: string) => {
    const validTabs: NavigationTab[] = ['dashboard', 'save', 'borrow', 'grow', 'goals', 'insights'];
    if (validTabs.includes(tab as NavigationTab)) {
      setActiveTab(tab as NavigationTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle completion of onboarding
  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...data,
      isOnboarded: true,
    }));
    setViewMode('app');
    setActiveTab('dashboard');
  };

  // Render Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setViewMode('onboarding')}
        onSkipToDemo={() => setViewMode('app')}
      />
    );
  }

  // Render Onboarding Wizard
  if (viewMode === 'onboarding') {
    return (
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        onSkip={() => setViewMode('app')}
      />
    );
  }

  // Render Main FinWise Dashboard Application
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1A1F2C] flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        currentTab={activeTab}
        onSelectTab={handleNavigateTab}
        onOpenAskFinWise={() => handleOpenAskDrawer()}
        onSignOut={() => setViewMode('landing')}
        userName={userProfile.name}
        healthScore={userProfile.healthScore}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header */}
        <Header
          userProfile={userProfile}
          currentTab={activeTab}
          activeTab={activeTab}
          onOpenAskFinWise={() => handleOpenAskDrawer()}
          onOpenLanding={() => setViewMode('landing')}
          onRestartOnboarding={() => setViewMode('onboarding')}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              recommendations={recommendations}
              onNavigateTab={handleNavigateTab}
              onOpenAskDrawer={handleOpenAskDrawer}
            />
          )}

          {activeTab === 'save' && (
            <SaveView
              userProfile={userProfile}
              onNavigateTab={handleNavigateTab}
              onOpenAskDrawer={handleOpenAskDrawer}
            />
          )}

          {activeTab === 'borrow' && (
            <BorrowView
              userProfile={userProfile}
              onOpenAskDrawer={handleOpenAskDrawer}
            />
          )}

          {activeTab === 'grow' && (
            <GrowView
              userProfile={userProfile}
              onNavigateTab={handleNavigateTab}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView
              userProfile={userProfile}
              onNavigateTab={handleNavigateTab}
              onUpdateGoals={(goals) =>
                setUserProfile((prev) => ({ ...prev, goals }))
              }
              onOpenAskDrawer={handleOpenAskDrawer}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView
              userProfile={userProfile}
              recommendations={recommendations}
              onNavigateTab={handleNavigateTab}
              onOpenAskDrawer={handleOpenAskDrawer}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
        onOpenAskFinWise={() => handleOpenAskDrawer()}
      />

      {/* Slide-over Ask FinWise AI Assistant Drawer */}
      <AskFinWiseDrawer
        isOpen={isAskDrawerOpen}
        onClose={() => {
          setIsAskDrawerOpen(false);
          setDrawerQuery(undefined);
        }}
        initialQuery={drawerQuery}
        userProfile={userProfile}
      />
    </div>
  );
}
