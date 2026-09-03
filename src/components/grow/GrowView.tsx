import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Layers,
  PieChart as PieIcon,
  CheckCircle2,
  HelpCircle,
  X,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { educationalInvestmentData } from '../../data/mockData';
import { formatCurrency } from '../../utils/calculations';

interface GrowViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: string) => void;
}

export const GrowView: React.FC<GrowViewProps> = ({ userProfile, onNavigateTab }) => {
  const currencySymbol = userProfile.currencySymbol;
  const [activeLearnMore, setActiveLearnMore] = useState<any | null>(null);

  // Allocation educational example (60% Broad Index, 25% Fixed Income, 15% Emergency Buffer)
  const educationalAllocation = [
    { name: 'Broad-Market Equity Indexes', share: 55, color: '#4f46e5' },
    { name: 'Fixed-Income & Debt Reserves', share: 25, color: '#10b981' },
    { name: 'Liquid Emergency Cushion', share: 20, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Sustainable Wealth Building
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1F2C] mt-1">
          Grow
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore diversified ways to put your savings to work based on your goals, timeline and comfort with risk.
        </p>
      </div>

      {/* Top Banner: Your Investor Profile */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Your Investor Profile
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Assessed via Onboarding
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Risk Comfort</p>
            <p className="text-base font-extrabold text-[#1A1F2C] mt-1">{userProfile.riskProfile}</p>
            <p className="text-[11px] text-gray-500">Patient through cycles</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Time Horizon</p>
            <p className="text-base font-extrabold text-[#1A1F2C] mt-1">{userProfile.timeHorizon}</p>
            <p className="text-[11px] text-gray-500">Long-term orientation</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Emergency Fund</p>
            <p className="text-base font-extrabold text-amber-700 mt-1">Building Buffer</p>
            <p className="text-[11px] text-gray-500">₹60k of ₹1.8L target</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Debt Position</p>
            <p className="text-base font-extrabold text-emerald-700 mt-1">Manageable</p>
            <p className="text-[11px] text-gray-500">₹5,000/month liability</p>
          </div>
        </div>
      </div>

      {/* Prominent Card: "Before you invest" */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Before You Invest
              </span>
              <h3 className="text-lg font-bold text-[#1A1F2C] mt-0.5">
                Your emergency fund is still below its target.
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed max-w-2xl">
                Current: <strong>{formatCurrency(userProfile.savings.emergencyFund, currencySymbol)}</strong> • Target: <strong>{formatCurrency(userProfile.savings.emergencyTarget, currencySymbol)}</strong>.
                Recommendation: Continue strengthening your emergency buffer before significantly increasing long-term investments.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="view-emergency-plan-btn"
            onClick={() => onNavigateTab('goals')}
            className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>View Emergency Fund Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Educational Investment Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#1A1F2C]">
              Explore Investment Categories
            </h2>
            <p className="text-xs text-gray-500">
              Broad-market structures to understand diversified asset classes.
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Non-speculative
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationalInvestmentData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      item.riskLevel.includes('Moderate')
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : item.riskLevel.includes('Lower')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    Risk: {item.riskLevel}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">
                    Div: {item.diversification}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1A1F2C] mb-1">{item.title}</h3>
                <p className="text-xs font-semibold text-indigo-600 mb-3">{item.typicalUse}</p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="button"
                  id={`learn-more-${item.id}`}
                  onClick={() => setActiveLearnMore(item)}
                  className="w-full py-2.5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-[#1A1F2C] hover:text-indigo-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mock Educational Asset Allocation Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-[#1A1F2C]">
                Balanced Asset Allocation Architecture
              </h3>
            </div>
            <p className="text-xs font-semibold text-amber-700 mt-1">
              Educational example — not a personalized investment instruction.
            </p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 self-start sm:self-auto">
            Sample Moderate Profile
          </span>
        </div>

        {/* Stacked Allocation Bar */}
        <div className="space-y-4">
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100">
            {educationalAllocation.map((sec) => (
              <div
                key={sec.name}
                style={{ width: `${sec.share}%`, backgroundColor: sec.color }}
                className="h-full transition-all"
                title={`${sec.name}: ${sec.share}%`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {educationalAllocation.map((sec) => (
              <div key={sec.name} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: sec.color }}
                />
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-[#1A1F2C]">{sec.share}%</span>
                    <span className="text-xs font-bold text-gray-700">{sec.name}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {sec.share === 55
                      ? 'Spreads exposure across 500+ top enterprises'
                      : sec.share === 25
                      ? 'Government bonds & high-grade short duration funds'
                      : 'Liquid savings reserve in high-yield savings'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Universal Safety Notice */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
          <span>
            <strong>Important Risk Notice:</strong> All investments involve risk. Returns are not guaranteed. Past performance does not indicate future results. FinWise does not execute trades or recommend individual stocks.
          </span>
        </div>
      </div>

      {/* Learn More Modal Dialog */}
      {activeLearnMore && (
        <div className="fixed inset-0 z-50 bg-[#1A1F2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Asset Class Deep Dive
                </span>
                <h3 className="text-xl font-bold text-[#1A1F2C] mt-1">{activeLearnMore.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLearnMore(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <p>{activeLearnMore.description}</p>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <h5 className="font-bold text-[#1A1F2C] text-xs uppercase tracking-wider mb-2">
                  Key Principles
                </h5>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {activeLearnMore.keyPoints.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-indigo-50 text-indigo-800 rounded-xl text-xs border border-indigo-100">
                Typical Portfolio Context: <strong>{activeLearnMore.exampleAllocation}</strong>
              </div>

              <p className="text-[11px] text-gray-400">
                FinWise provides this solely for educational context to help you frame long-term diversification.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLearnMore(null)}
                className="px-4 py-2 rounded-xl bg-[#1A1F2C] hover:bg-gray-800 text-white text-xs font-semibold transition-colors"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
