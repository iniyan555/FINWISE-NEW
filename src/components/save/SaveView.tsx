import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Film,
  Repeat,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, SavingsOpportunity } from '../../types';
import { savingsOpportunitiesData } from '../../data/mockData';
import {
  formatCurrency,
  getTotalExpenses,
  getEssentialExpenses,
  getLifestyleExpenses,
} from '../../utils/calculations';

interface SaveViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: string) => void;
  onOpenAskDrawer?: (query?: string) => void;
}

export const SaveView: React.FC<SaveViewProps> = ({ userProfile, onNavigateTab, onOpenAskDrawer }) => {
  const currencySymbol = userProfile.currencySymbol || '₹';
  const [opportunities, setOpportunities] = useState<SavingsOpportunity[]>(savingsOpportunitiesData);
  const [openWhy, setOpenWhy] = useState<Record<string, boolean>>({
    'save-shopping': true, // Open by default for demo clarity
  });

  const totalSpending = getTotalExpenses(userProfile.expenses);
  const income = userProfile.income.monthlyTakeHome;
  const currentSurplus = Math.max(0, income - totalSpending);
  const [extraSavingsSlider, setExtraSavingsSlider] = useState<number>(4000);

  const toggleWhy = (id: string) => {
    setOpenWhy((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAddToPlan = (id: string) => {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAddedToPlan: !item.isAddedToPlan } : item
      )
    );
  };

  // Spending categories breakdown with highlight flag
  const spendingCategories = [
    { name: 'Housing', amount: userProfile.expenses.housing || 0, type: 'Essential', optimizable: false },
    { name: 'Groceries', amount: userProfile.expenses.groceries || 0, type: 'Essential', optimizable: false },
    { name: 'Transport', amount: userProfile.expenses.transport || 0, type: 'Essential', optimizable: false },
    { name: 'Utilities', amount: userProfile.expenses.utilities || 0, type: 'Essential', optimizable: false },
    { name: 'Shopping', amount: userProfile.expenses.shopping || 0, type: 'Lifestyle', optimizable: true, potential: `${currencySymbol}1,500 - ${currencySymbol}2,000` },
    { name: 'Entertainment', amount: userProfile.expenses.entertainment || 0, type: 'Lifestyle', optimizable: true, potential: `${currencySymbol}1,200` },
    { name: 'Subscriptions', amount: userProfile.expenses.subscriptions || 0, type: 'Lifestyle', optimizable: true, potential: `${currencySymbol}800` },
    { name: 'Other', amount: userProfile.expenses.other || 0, type: 'Other', optimizable: false },
  ].filter((c) => c.amount > 0);

  const targetSurplus = currentSurplus + extraSavingsSlider;
  const potentialSavingsRate = income > 0 ? Math.round((targetSurplus / income) * 100) : 0;

  // What if calculations (pure contributions)
  const oneYearExtra = extraSavingsSlider * 12;
  const threeYearsExtra = extraSavingsSlider * 36;
  const fiveYearsExtra = extraSavingsSlider * 60;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Expense Optimization
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1F2C] mt-1">
          Save
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Understand where your money goes and find realistic opportunities to save more without sacrificing your lifestyle.
        </p>
      </div>

      {/* Top Hero Card */}
      <div className="bg-[#1A1F2C] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-gray-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Identified Potential</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            You could potentially save <span className="text-indigo-300">₹4,500 more</span> every month.
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm mt-2 leading-relaxed">
            By trimming small discretionary spikes in shopping, entertainment, and redundant subscriptions, you can boost your surplus significantly.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-700/60 flex flex-wrap items-center gap-6 sm:gap-12">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Current Savings Rate
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">31%</p>
              <p className="text-[11px] text-gray-400">₹22,000 / month</p>
            </div>

            <div className="h-10 w-px bg-gray-700/60 hidden sm:block" />

            <div>
              <p className="text-xs font-medium text-indigo-300 uppercase tracking-wider">
                Potential Savings Rate
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">37%</p>
              <p className="text-[11px] text-indigo-200">₹26,500 / month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Breakdown Table / Visualizer */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#1A1F2C]">Spending Breakdown by Category</h3>
            <p className="text-xs text-gray-500">Categories with realistic optimization opportunities are highlighted below</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full self-start sm:self-auto">
            Total: {formatCurrency(totalSpending, currencySymbol)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {spendingCategories.map((cat) => {
            const pct = ((cat.amount / totalSpending) * 100).toFixed(1);
            return (
              <div
                key={cat.name}
                className={`p-4 rounded-2xl border transition-all ${
                  cat.optimizable
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                  {cat.optimizable ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      Trim Opp
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-gray-400">{cat.type}</span>
                  )}
                </div>
                <p className="text-xl font-extrabold text-[#1A1F2C]">
                  {formatCurrency(cat.amount, currencySymbol)}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                  <span>{pct}% of spending</span>
                  {cat.potential && (
                    <span className="text-amber-700 font-semibold">Save {cat.potential}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Major Section: ✨ Savings Opportunities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#1A1F2C]">
              ✨ Savings Opportunities
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Personalized Actions
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Shopping */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-[#1A1F2C] text-base">Shopping</h4>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Easy
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Current:</span>
                  <span className="font-bold text-[#1A1F2C]">₹7,000/month</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Suggested range:</span>
                  <span className="font-bold text-indigo-700">₹5,000–₹5,500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Potential saving:</span>
                  <span className="font-extrabold text-emerald-600">₹1,500–₹2,000/month</span>
                </div>
              </div>

              {/* Expandable "Why?" */}
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                <button
                  type="button"
                  id="why-shopping-btn"
                  onClick={() => toggleWhy('save-shopping')}
                  className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span>Why?</span>
                  {openWhy['save-shopping'] ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </button>
                {openWhy['save-shopping'] && (
                  <div className="p-3 bg-white text-gray-600 text-xs leading-relaxed border-t border-gray-100">
                    Shopping is one of your largest discretionary categories. A moderate reduction could redirect approximately ₹18,000–₹24,000 per year toward your financial goals.
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              id="add-shopping-to-plan"
              onClick={() => toggleAddToPlan('save-shopping')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                opportunities.find((o) => o.id === 'save-shopping')?.isAddedToPlan
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {opportunities.find((o) => o.id === 'save-shopping')?.isAddedToPlan
                  ? 'Added to Plan'
                  : 'Add to Plan'}
              </span>
            </button>
          </div>

          {/* Card 2: Entertainment */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <Film className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-[#1A1F2C] text-base">Entertainment</h4>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Easy
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Current:</span>
                  <span className="font-bold text-[#1A1F2C]">₹5,000/month</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Suggested range:</span>
                  <span className="font-bold text-indigo-700">₹3,800</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Potential saving:</span>
                  <span className="font-extrabold text-emerald-600">₹1,200/month</span>
                </div>
              </div>

              {/* Expandable "Why?" */}
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                <button
                  type="button"
                  id="why-entertainment-btn"
                  onClick={() => toggleWhy('save-entertainment')}
                  className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span>Why?</span>
                  {openWhy['save-entertainment'] ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </button>
                {openWhy['save-entertainment'] && (
                  <div className="p-3 bg-white text-gray-600 text-xs leading-relaxed border-t border-gray-100">
                    Weekend leisure bookings and dine-outs can be planned with deliberate allowances, yielding ₹14,400 per year into your emergency buffer.
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              id="add-entertainment-to-plan"
              onClick={() => toggleAddToPlan('save-entertainment')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                opportunities.find((o) => o.id === 'save-entertainment')?.isAddedToPlan
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {opportunities.find((o) => o.id === 'save-entertainment')?.isAddedToPlan
                  ? 'Added to Plan'
                  : 'Add to Plan'}
              </span>
            </button>
          </div>

          {/* Card 3: Subscriptions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Repeat className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-[#1A1F2C] text-base">Subscriptions</h4>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Easy
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Current:</span>
                  <span className="font-bold text-[#1A1F2C]">₹3,000/month</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Suggested range:</span>
                  <span className="font-bold text-indigo-700">₹2,200</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Potential saving:</span>
                  <span className="font-extrabold text-emerald-600">₹800/month</span>
                </div>
              </div>

              {/* Expandable "Why?" */}
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                <button
                  type="button"
                  id="why-subscriptions-btn"
                  onClick={() => toggleWhy('save-subscriptions')}
                  className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span>Why?</span>
                  {openWhy['save-subscriptions'] ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </button>
                {openWhy['save-subscriptions'] && (
                  <div className="p-3 bg-white text-gray-600 text-xs leading-relaxed border-t border-gray-100">
                    You have overlapping streaming memberships and inactive cloud tools. Consolidating 2 redundant plans recovers ₹9,600/year effortlessly.
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              id="add-subscriptions-to-plan"
              onClick={() => toggleAddToPlan('save-subscriptions')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                opportunities.find((o) => o.id === 'save-subscriptions')?.isAddedToPlan
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {opportunities.find((o) => o.id === 'save-subscriptions')?.isAddedToPlan
                  ? 'Added to Plan'
                  : 'Add to Plan'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Savings Target Section & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Target Slider Section */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-[#1A1F2C]">Savings Target Simulator</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Current monthly surplus:</span>
              <span className="font-bold text-[#1A1F2C]">{formatCurrency(currentSurplus, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Suggested target surplus:</span>
              <span className="font-bold text-indigo-700">{formatCurrency(targetSurplus, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Additional monthly amount needed:</span>
              <span className="font-bold text-emerald-600">+{formatCurrency(extraSavingsSlider, currencySymbol)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span>Experiment with extra monthly savings:</span>
              <span className="text-base text-indigo-600 font-extrabold">
                +{formatCurrency(extraSavingsSlider, currencySymbol)}/mo
              </span>
            </div>
            <input
              type="range"
              id="savings-extra-slider"
              min="1000"
              max="8000"
              step="500"
              value={extraSavingsSlider}
              onChange={(e) => setExtraSavingsSlider(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>+₹1,000</span>
              <span>+₹4,500 recommended</span>
              <span>+₹8,000</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 text-xs text-gray-700">
            <p className="font-semibold text-indigo-950 mb-1">
              New Projected Savings Rate: <span className="font-extrabold">{potentialSavingsRate}%</span>
            </p>
            <p className="leading-relaxed">
              Saving an extra {formatCurrency(extraSavingsSlider, currencySymbol)} per month increases your surplus to {formatCurrency(targetSurplus, currencySymbol)}, accelerating your goals without taking any market risk.
            </p>
          </div>
        </div>

        {/* "What If?" Simulator */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-[#1A1F2C]">"What If?" Contribution Forecast</h3>
              </div>
              <span className="text-xs font-semibold text-gray-400">Cash contributions only</span>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              If you save an extra <strong className="text-[#1A1F2C] font-bold">{formatCurrency(extraSavingsSlider, currencySymbol)}/month</strong>, here is how your accumulated cash contributions scale over time:
            </p>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-700">1 Year</p>
                  <p className="text-[11px] text-gray-400">12 monthly contributions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-[#1A1F2C]">
                    +{formatCurrency(oneYearExtra, currencySymbol)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Additional contributions</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-700">3 Years</p>
                  <p className="text-[11px] text-gray-400">36 monthly contributions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-indigo-600">
                    +{formatCurrency(threeYearsExtra, currencySymbol)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Additional contributions</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-700">5 Years</p>
                  <p className="text-[11px] text-gray-400">60 monthly contributions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-emerald-600">
                    +{formatCurrency(fiveYearsExtra, currencySymbol)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Additional contributions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Estimates reflect pure cash contributions without assuming speculative investment returns.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
