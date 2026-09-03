import React, { useState } from 'react';
import {
  Target,
  Plus,
  ShieldCheck,
  Laptop,
  Plane,
  Calendar,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  X,
} from 'lucide-react';
import { UserProfile, GoalItem } from '../../types';
import {
  formatCurrency,
  getMonthsRemaining,
  calculateMonthlyGoalContribution,
} from '../../utils/calculations';

interface GoalsViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: string) => void;
  onUpdateGoals?: (goals: GoalItem[]) => void;
  onOpenAskDrawer?: (query?: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  userProfile,
  onNavigateTab,
  onUpdateGoals,
  onOpenAskDrawer,
}) => {
  const currencySymbol = userProfile.currencySymbol || '₹';
  const [goals, setGoals] = useState<GoalItem[]>(userProfile.goals);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(goals[1] || goals[0] || null);

  // Add Goal Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState<number>(100000);
  const [newCurrent, setNewCurrent] = useState<number>(10000);
  const [newDate, setNewDate] = useState('December 2027');

  // Simulator for changing target date on selected goal
  // Months offset slider (-6 to +24 months)
  const [dateExtensionMonths, setDateExtensionMonths] = useState<number>(0);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      title: newTitle,
      category: 'Custom Milestone',
      targetAmount: newTarget,
      currentAmount: newCurrent,
      targetDate: newDate,
      iconName: 'Target',
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    setSelectedGoal(newGoal);
    setIsAddModalOpen(false);
    setNewTitle('');
    if (onUpdateGoals) {
      onUpdateGoals(updated);
    }
  };

  const getGoalIcon = (title: string) => {
    if (title.toLowerCase().includes('emergency')) return ShieldCheck;
    if (title.toLowerCase().includes('laptop') || title.toLowerCase().includes('tech')) return Laptop;
    if (title.toLowerCase().includes('travel') || title.toLowerCase().includes('japan')) return Plane;
    return Target;
  };

  // Calculations for selected goal
  const target = selectedGoal?.targetAmount || 120000;
  const saved = selectedGoal?.currentAmount || 60000;
  const remaining = Math.max(0, target - saved);
  const baseMonths = selectedGoal ? getMonthsRemaining(selectedGoal.targetDate) : 18;
  const effectiveMonths = Math.max(1, baseMonths + dateExtensionMonths);
  const requiredMonthlyContribution = Math.round(remaining / effectiveMonths);
  const originalMonthlyContribution = Math.round(remaining / Math.max(1, baseMonths));

  const pct = Math.min(100, Math.round((saved / target) * 100));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Purpose-Driven Planning
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1F2C] mt-1">
            Goals
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Turn the things you want into a realistic, step-by-step financial plan.
          </p>
        </div>

        <button
          type="button"
          id="add-goal-trigger"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goal Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {goals.map((g) => {
          const Icon = getGoalIcon(g.title);
          const completion = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const isSelected = selectedGoal?.id === g.id;

          return (
            <div
              key={g.id}
              id={`goal-card-${g.id}`}
              onClick={() => {
                setSelectedGoal(g);
                setDateExtensionMonths(0);
              }}
              className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/10 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-extrabold text-[#1A1F2C]">{completion}%</span>
              </div>

              <h4 className="font-bold text-base text-[#1A1F2C]">{g.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">Target: {g.targetDate}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-gray-500">Saved:</span>
                <span className="font-bold text-[#1A1F2C]">
                  {formatCurrency(g.currentAmount, currencySymbol)} / {formatCurrency(g.targetAmount, currencySymbol)}
                </span>
              </div>

              <div className="mt-2 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Goal Detail Panel */}
      {selectedGoal && (
        <div
          id="selected-goal-detail-panel"
          className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-8"
        >
          {/* Header of Detail */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                {React.createElement(getGoalIcon(selectedGoal.title), { className: 'w-6 h-6' })}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Goal Roadmap
                </span>
                <h3 className="text-2xl font-extrabold text-[#1A1F2C] mt-0.5">
                  {selectedGoal.title}
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-400 font-semibold uppercase">Target Date</p>
              <p className="text-base font-bold text-[#1A1F2C]">{selectedGoal.targetDate}</p>
            </div>
          </div>

          {/* Goal Statistics 4-Col Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold uppercase text-gray-400">Target Amount</p>
              <p className="text-xl font-extrabold text-[#1A1F2C] mt-1">
                {formatCurrency(target, currencySymbol)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold uppercase text-gray-400">Saved So Far</p>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                {formatCurrency(saved, currencySymbol)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold uppercase text-gray-400">Remaining Gap</p>
              <p className="text-xl font-extrabold text-[#1A1F2C] mt-1">
                {formatCurrency(remaining, currencySymbol)}
              </p>
            </div>

            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100">
              <p className="text-[11px] font-bold uppercase text-indigo-700">Required Monthly</p>
              <p className="text-xl font-extrabold text-indigo-700 mt-1">
                {formatCurrency(requiredMonthlyContribution, currencySymbol)}/mo
              </p>
              <p className="text-[10px] text-indigo-600 mt-0.5">{effectiveMonths} months remaining</p>
            </div>
          </div>

          {/* Section: "✨ How to close the gap" — Connecting SAVE directly to GOALS */}
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="text-base font-bold text-[#1A1F2C]">
                ✨ How to close the gap (Connect with Save)
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Instead of needing extra salary, you can fund this goal completely by capturing your identified savings opportunities:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
                <p className="font-bold text-[#1A1F2C]">Trim Subscriptions</p>
                <p className="text-emerald-700 font-extrabold text-sm mt-0.5">+₹500/month</p>
                <p className="text-[11px] text-gray-500 mt-1">Cancel 1 unused entertainment plan</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
                <p className="font-bold text-[#1A1F2C]">Reduce Entertainment</p>
                <p className="text-emerald-700 font-extrabold text-sm mt-0.5">+₹1,000/month</p>
                <p className="text-[11px] text-gray-500 mt-1">Cap impulse weekend leisure spending</p>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs flex flex-col justify-between">
                <div>
                  <p className="font-bold text-indigo-900">Redirected Power</p>
                  <p className="text-indigo-700 font-extrabold text-sm mt-0.5">+₹1,500/month</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('save')}
                  className="mt-2 text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Review in Save Tab</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Redirecting ₹1,500/month covers the required {formatCurrency(requiredMonthlyContribution, currencySymbol)}/month contribution with zero stress on your primary budget!
              </span>
            </div>
          </div>

          {/* "Change target date" simulator */}
          <div className="p-6 rounded-3xl bg-white border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-[#1A1F2C]">
                  Target Date Flexibility Simulator
                </h4>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                Demonstrates how extending deadline lowers monthly cost
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Extend / adjust timeline:</span>
                <span className="text-indigo-600">
                  {dateExtensionMonths === 0
                    ? 'Target Timeline (Default)'
                    : `+${dateExtensionMonths} months extended (${effectiveMonths} total mos)`}
                </span>
              </div>
              <input
                type="range"
                id="goal-timeline-slider"
                min="0"
                max="24"
                step="3"
                value={dateExtensionMonths}
                onChange={(e) => setDateExtensionMonths(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Original ({baseMonths} mos)</span>
                <span>+12 months</span>
                <span>+24 months</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-gray-800">
                  Adjusted monthly requirement:{' '}
                  <span className="text-base font-extrabold text-indigo-700">
                    {formatCurrency(requiredMonthlyContribution, currencySymbol)}/month
                  </span>
                </p>
                {dateExtensionMonths > 0 && (
                  <p className="text-gray-500 mt-0.5">
                    Extending the date reduces your monthly requirement by{' '}
                    <strong className="text-emerald-600">
                      {formatCurrency(originalMonthlyContribution - requiredMonthlyContribution, currencySymbol)}/month
                    </strong>.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDateExtensionMonths(0)}
                className="text-xs text-gray-500 hover:text-gray-900 underline self-start sm:self-auto"
              >
                Reset to Original
              </button>
            </div>

            {onOpenAskDrawer && (
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  id="goal-ask-finwise-btn"
                  onClick={() =>
                    onOpenAskDrawer(
                      `How can I reach my "${selectedGoal.title}" goal (${formatCurrency(selectedGoal.targetAmount, currencySymbol)}) faster using my current monthly surplus?`
                    )
                  }
                  className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>✨ Ask FinWise AI: "How can I reach {selectedGoal.title} faster?"</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Goal Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1F2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1A1F2C]">Create New Goal</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  id="new-goal-title"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Higher Education Fund"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1A1F2C] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Target Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  id="new-goal-target"
                  required
                  min="1000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1A1F2C] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Already Saved ({currencySymbol})
                </label>
                <input
                  type="number"
                  id="new-goal-saved"
                  min="0"
                  value={newCurrent}
                  onChange={(e) => setNewCurrent(Number(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1A1F2C] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Target Date
                </label>
                <input
                  type="text"
                  id="new-goal-date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. June 2028"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1A1F2C]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-create-goal"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Create Goal ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
