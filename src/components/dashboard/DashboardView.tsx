import React from 'react';
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Plane,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, Recommendation, GoalItem } from '../../types';
import { HealthScoreGauge } from '../common/HealthScoreGauge';
import { MetricCard } from '../common/MetricCard';
import { RecommendationCard } from '../common/RecommendationCard';
import { InsightCard } from '../common/InsightCard';
import {
  formatCurrency,
  getTotalExpenses,
  getEssentialExpenses,
  getLifestyleExpenses,
} from '../../utils/calculations';

interface DashboardViewProps {
  userProfile: UserProfile;
  recommendations: Recommendation[];
  onNavigateTab: (tab: string) => void;
  onOpenAskDrawer?: (query?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  recommendations,
  onNavigateTab,
  onOpenAskDrawer,
}) => {
  const currencySymbol = userProfile.currencySymbol || '₹';
  const income = userProfile.income.monthlyTakeHome;
  const spending = getTotalExpenses(userProfile.expenses);
  const essential = getEssentialExpenses(userProfile.expenses);
  const lifestyle = getLifestyleExpenses(userProfile.expenses);
  const subscriptions = userProfile.expenses.subscriptions || 0;
  const other = userProfile.expenses.other || 0;
  const surplus = income - spending;
  const savingsRate = income > 0 ? Math.max(0, Math.round((surplus / income) * 100)) : 0;
  const spendingRate = income > 0 ? Math.round((spending / income) * 100) : 0;

  const monthsBuffer = essential > 0 ? (userProfile.savings.emergencyFund / essential).toFixed(1) : '0';

  // Spending categories for dynamic breakdown
  const categoryData = [
    {
      name: 'Essential',
      amount: essential,
      percentage: spending > 0 ? Number(((essential / spending) * 100).toFixed(1)) : 0,
      color: '#4f46e5',
      highlight: false,
    },
    {
      name: 'Lifestyle',
      amount: lifestyle,
      percentage: spending > 0 ? Number(((lifestyle / spending) * 100).toFixed(1)) : 0,
      color: '#f59e0b',
      highlight: lifestyle > 0.2 * income,
    },
    ...(subscriptions > 0
      ? [
          {
            name: 'Subscriptions',
            amount: subscriptions,
            percentage: spending > 0 ? Number(((subscriptions / spending) * 100).toFixed(1)) : 0,
            color: '#8b5cf6',
            highlight: false,
          },
        ]
      : []),
    ...(other > 0
      ? [
          {
            name: 'Other',
            amount: other,
            percentage: spending > 0 ? Number(((other / spending) * 100).toFixed(1)) : 0,
            color: '#9ca3af',
            highlight: false,
          },
        ]
      : []),
  ];

  const getGoalIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-4 h-4" />;
      case 'Plane':
        return <Plane className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1F2C]">
              Good morning, {userProfile.name} 👋
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Here's how your money is looking this month. You're on track with a healthy {savingsRate}% savings rate.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-xs text-xs text-gray-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>September 2026</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('save')}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span>Optimize Spend</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Quick Coach Banner */}
      {onOpenAskDrawer && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-200 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">Ask FinWise Financial Coach</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                  Powered by Gemini
                </span>
              </div>
              <p className="text-xs text-indigo-100/80 mt-1 max-w-xl leading-relaxed">
                Wondering if you can afford a purchase, whether to prepay your loan, or how to reach your goals faster? Ask any question with your actual numbers.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              id="dash-ai-prompt-btn"
              onClick={() => onOpenAskDrawer('Can I afford a ₹20,000 purchase this month?')}
              className="text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-xl text-white transition-colors"
            >
              "Can I afford a purchase?"
            </button>
            <button
              type="button"
              id="dash-open-ai-chat"
              onClick={() => onOpenAskDrawer()}
              className="text-xs font-semibold bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>Ask FinWise</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Overview Grid: Health Score Card & Primary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Financial Health Score Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Financial Health Score
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Optimal
            </span>
          </div>

          <div className="my-4">
            <HealthScoreGauge
              score={userProfile.healthScore}
              maxScore={100}
              change={userProfile.healthScoreChange}
              status="GOOD"
              size="lg"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Your score reflects a strong {savingsRate}% savings rate and manageable debt liabilities, supported by an ongoing emergency reserve.
            </p>
          </div>
        </div>

        {/* 3 Primary Summary Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            id="metric-income"
            title="Income"
            value={formatCurrency(income, currencySymbol)}
            subtext="Monthly net salary"
            change="Stable"
            changeType="positive"
            icon={Wallet}
          />
          <MetricCard
            id="metric-spending"
            title="Spending"
            value={formatCurrency(spending, currencySymbol)}
            subtext={`${spendingRate}% of monthly income`}
            change="-₹1,500 vs last month"
            changeType="positive"
            icon={TrendingUp}
          />
          <MetricCard
            id="metric-surplus"
            title="Monthly Surplus"
            value={formatCurrency(surplus, currencySymbol)}
            subtext={`${savingsRate}% savings rate`}
            change="+₹4,000 growth"
            changeType="positive"
            icon={PiggyBank}
            badge={`Surplus: ${formatCurrency(surplus, currencySymbol)}`}
          />

          {/* Quick Sub-Metrics row for context */}
          <div className="sm:col-span-3 bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Emergency Fund Buffer</p>
                <p className="text-sm font-bold text-[#1A1F2C]">
                  {formatCurrency(userProfile.savings.emergencyFund, currencySymbol)} / {formatCurrency(userProfile.savings.emergencyTarget, currencySymbol)}
                  <span className="text-xs font-semibold text-gray-400 ml-1.5">({monthsBuffer} months saved)</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('goals')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-end sm:self-auto"
            >
              <span>Manage Buffer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Hero Card: ✨ Your Action Plan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#1A1F2C]">
              ✨ Your Action Plan
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Ranked by impact
            </span>
          </div>
          <button
            type="button"
            id="view-full-plan-btn"
            onClick={() => onNavigateTab('save')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View Full Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Ranked Recommendations with 5-step UX pattern */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.slice(0, 3).map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onActionClick={(tab) => onNavigateTab(tab)}
            />
          ))}
        </div>
      </section>

      {/* Two Columns: Spending Overview & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spending Overview Section */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1A1F2C]">Spending Overview</h3>
                <p className="text-xs text-gray-500">Monthly breakdown across categories</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('save')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Bar Visualizer */}
            <div className="space-y-3.5 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-gray-700">{cat.name}</span>
                      {cat.highlight && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-200">
                          Trim Opportunity
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-[#1A1F2C]">
                      {formatCurrency(cat.amount, currencySymbol)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight Card for Spending */}
          <div className="mt-6">
            <InsightCard
              id="dashboard-spending-insight"
              title="FinWise noticed"
              message={`Your lifestyle spending is currently ${formatCurrency(lifestyle, currencySymbol)}. Trimming shopping or entertainment by just 15% could unlock +${formatCurrency(Math.round(lifestyle * 0.15), currencySymbol)}/month toward your goals.`}
              ctaText="See Savings Opportunities"
              onCtaClick={() => onNavigateTab('save')}
              tone="amber"
            />
          </div>
        </div>

        {/* Goal Progress Section */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1A1F2C]">Goal Progress</h3>
                <p className="text-xs text-gray-500">Active milestones and savings trajectories</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('goals')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Dynamic Goal Cards from userProfile.goals */}
            <div className="space-y-3">
              {userProfile.goals && userProfile.goals.length > 0 ? (
                userProfile.goals.slice(0, 3).map((goal) => {
                  const percent = goal.targetAmount > 0
                    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                    : 0;
                  return (
                    <div
                      key={goal.id}
                      onClick={() => onNavigateTab('goals')}
                      className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                            {getGoalIcon(goal.iconName)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#1A1F2C]">{goal.title}</h4>
                            <p className="text-xs text-gray-500">Target: {goal.targetDate || 'Ongoing'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-[#1A1F2C]">{percent}%</span>
                          <p className="text-[11px] text-gray-500">
                            {formatCurrency(goal.currentAmount, currencySymbol)} / {formatCurrency(goal.targetAmount, currencySymbol)}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No active goals yet. Click below to add your first goal.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Regular surplus allocation keeps goals on track
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('goals')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Simulate Dates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
