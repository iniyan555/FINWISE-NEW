import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile, DebtItem, GoalItem, RiskProfile } from '../../types';
import { initialUserProfile } from '../../data/mockData';
import { formatCurrency } from '../../utils/calculations';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
  onSkip?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onCancel,
  onSkip,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 7;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStage, setAnalyzingStage] = useState('Evaluating monthly income & expenses...');

  // State initialized with sensible defaults
  const [formData, setFormData] = useState<UserProfile>({
    ...initialUserProfile,
  });

  // Dynamic calculation of total expenses in step 3
  const totalEnteredExpenses: number = (
    Object.values(formData.expenses) as number[]
  ).reduce((acc: number, curr: number) => acc + (Number(curr) || 0), 0);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Step 7 finished: Trigger analyzing animation
      setIsAnalyzing(true);
      setAnalyzingStage('Calculating debt burden and savings surplus...');

      setTimeout(() => {
        setAnalyzingStage('Auditing discretionary lifestyle categories...');
      }, 700);

      setTimeout(() => {
        setAnalyzingStage('Drafting personalized recommendations & health score...');
      }, 1400);

      setTimeout(() => {
        setIsAnalyzing(false);
        onComplete(formData);
      }, 2200);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      const exitFn = onCancel || onSkip || (() => {});
      exitFn();
    }
  };

  const handleFillDemoData = () => {
    setFormData({ ...initialUserProfile });
  };

  // Debt handling
  const [hasDebt, setHasDebt] = useState(formData.debts.length > 0);

  const addDebt = () => {
    const newDebt: DebtItem = {
      id: `debt-${Date.now()}`,
      type: 'Personal Loan',
      outstandingBalance: 100000,
      interestRate: 10.5,
      monthlyEmi: 4500,
    };
    setFormData((prev) => ({ ...prev, debts: [...prev.debts, newDebt] }));
  };

  const removeDebt = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      debts: prev.debts.filter((d) => d.id !== id),
    }));
  };

  // Goals handling
  const availableGoalTypes = [
    'Emergency Fund',
    'Laptop / Electronics',
    'Travel',
    'Education',
    'Vehicle',
    'Home',
    'Retirement',
    'Build Wealth',
    'Custom Goal',
  ];

  const addGoal = (title: string) => {
    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      title,
      category: title,
      targetAmount: title === 'Emergency Fund' ? 180000 : title === 'Laptop / Electronics' ? 120000 : 100000,
      currentAmount: title === 'Emergency Fund' ? 60000 : title === 'Laptop / Electronics' ? 60000 : 20000,
      targetDate: 'December 2027',
    };
    setFormData((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };

  const removeGoal = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  // Risk question response
  const [riskAnswer, setRiskAnswer] = useState<string>('wait');

  const handleRiskSelection = (opt: string) => {
    setRiskAnswer(opt);
    let derived: RiskProfile = 'Moderate';
    if (opt === 'sell') derived = 'Conservative';
    if (opt === 'wait') derived = 'Moderate';
    if (opt === 'stay') derived = 'Growth';
    setFormData((prev) => ({ ...prev, riskProfile: derived }));
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs animate-pulse mb-6">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1F2C] mb-2">
          FinWise is analyzing your finances...
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">{analyzingStage}</p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-[shimmer_2s_infinite] w-full" />
        </div>
        <p className="text-xs text-gray-400 mt-4">Calibrating your personal health score...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6">
      {/* Top Wizard Bar */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            id="wizard-back-btn"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1A1F2C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <button
              type="button"
              id="wizard-demo-fill-btn"
              onClick={handleFillDemoData}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-indigo-600" />
              <span>Fill Demo Profile</span>
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-10">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Step 1 — About You
                </span>
                <h2 className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                  Let's get to know you
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Basic details to personalize your financial benchmarks.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="wizard-input-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Age Range
                    </label>
                    <select
                      id="wizard-input-age"
                      value={formData.ageRange}
                      onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                    >
                      <option value="18–25">18–25</option>
                      <option value="26–35">26–35</option>
                      <option value="36–45">36–45</option>
                      <option value="46–60">46–60</option>
                      <option value="60+">60+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Currency
                    </label>
                    <select
                      id="wizard-input-currency"
                      value={formData.currency}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const symbol = val === 'INR' ? '₹' : val === 'USD' ? '$' : val === 'EUR' ? '€' : '£';
                        setFormData({ ...formData, currency: val, currencySymbol: symbol });
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                    >
                      <option value="INR">INR (₹) — Demo Default</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Employment Type
                    </label>
                    <select
                      id="wizard-input-employment"
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                    >
                      <option value="Salaried Professional">Salaried Professional</option>
                      <option value="Self-Employed / Freelancer">Self-Employed / Freelancer</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Financial Dependents
                    </label>
                    <input
                      type="number"
                      id="wizard-input-dependents"
                      min="0"
                      value={formData.dependents}
                      onChange={(e) => setFormData({ ...formData, dependents: Number(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INCOME */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Step 2 — Income
                </span>
                <h2 className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                  How much do you bring in?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Tell us about your net monthly take-home cash flow.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Monthly Take-Home Income ({formData.currencySymbol})
                  </label>
                  <input
                    type="number"
                    id="wizard-input-takehome"
                    value={formData.income.monthlyTakeHome || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        income: { ...formData.income, monthlyTakeHome: Number(e.target.value) || 0 },
                      })
                    }
                    placeholder="70000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                  />
                  <p className="text-xs text-gray-400 mt-1">Amount deposited after taxes & deductions</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Other Monthly Income ({formData.currencySymbol})
                  </label>
                  <input
                    type="number"
                    id="wizard-input-other-income"
                    value={formData.income.otherMonthly || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        income: { ...formData.income, otherMonthly: Number(e.target.value) || 0 },
                      })
                    }
                    placeholder="0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                  />
                  <p className="text-xs text-gray-400 mt-1">Rentals, freelancing, dividends</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Income Stability
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Stable', 'Mostly stable', 'Variable'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        id={`wizard-stability-${type.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            income: { ...formData.income, stability: type },
                          })
                        }
                        className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-center ${
                          formData.income.stability === type
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MONTHLY EXPENSES */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Step 3 — Monthly Expenses
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                    Where does your money go?
                  </h2>
                </div>
                <div className="text-right bg-indigo-50 border border-indigo-200 rounded-xl p-3 shrink-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    Monthly expenses entered
                  </p>
                  <p className="text-xl font-extrabold text-[#1A1F2C] mt-0.5">
                    {formatCurrency(totalEnteredExpenses, formData.currencySymbol)}
                  </p>
                </div>
              </div>

              {/* Essential Group */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                  Essential Expenses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { key: 'housing', label: 'Housing / Rent' },
                    { key: 'groceries', label: 'Groceries' },
                    { key: 'utilities', label: 'Utilities' },
                    { key: 'transport', label: 'Transport' },
                    { key: 'healthcare', label: 'Healthcare' },
                    { key: 'insurance', label: 'Insurance' },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-gray-600 font-medium mb-1">{item.label}</label>
                      <input
                        type="number"
                        id={`wizard-expense-${item.key}`}
                        value={(formData.expenses as any)[item.key] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expenses: {
                              ...formData.expenses,
                              [item.key]: Number(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-[#1A1F2C]"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Group */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                  Lifestyle & Discretionary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { key: 'shopping', label: 'Shopping / Retail' },
                    { key: 'entertainment', label: 'Entertainment' },
                    { key: 'subscriptions', label: 'Subscriptions' },
                    { key: 'dining', label: 'Dining / Food Delivery' },
                    { key: 'other', label: 'Other spending' },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-gray-600 font-medium mb-1">{item.label}</label>
                      <input
                        type="number"
                        id={`wizard-expense-${item.key}`}
                        value={(formData.expenses as any)[item.key] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expenses: {
                              ...formData.expenses,
                              [item.key]: Number(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-[#1A1F2C]"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SAVINGS & SAFETY */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Step 4 — Savings & Safety
                </span>
                <h2 className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                  What cushions do you have?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Cash reserves and current financial safety net.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Savings Account Balance ({formData.currencySymbol})
                  </label>
                  <input
                    type="number"
                    id="wizard-input-savings-balance"
                    value={formData.savings.accountBalance || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        savings: {
                          ...formData.savings,
                          accountBalance: Number(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="60000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Dedicated Emergency Fund ({formData.currencySymbol})
                  </label>
                  <input
                    type="number"
                    id="wizard-input-emergency-fund"
                    value={formData.savings.emergencyFund || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        savings: {
                          ...formData.savings,
                          emergencyFund: Number(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="60000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C] font-semibold"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Ideal target is ₹1,80,000 (approx. 4-6 months of essential bills).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Current Long-Term Investments ({formData.currencySymbol})
                  </label>
                  <input
                    type="number"
                    id="wizard-input-investments"
                    value={formData.savings.currentInvestments || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        savings: {
                          ...formData.savings,
                          currentInvestments: Number(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="25000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#1A1F2C]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DEBT */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Step 5 — Debt
                </span>
                <h2 className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                  Do you currently have any loans or debt?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Understanding EMI liabilities helps us calibrate safe borrow and save limits.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="wizard-debt-yes"
                  onClick={() => {
                    setHasDebt(true);
                    if (formData.debts.length === 0) addDebt();
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                    hasDebt
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  Yes, I have loans / debt
                </button>
                <button
                  type="button"
                  id="wizard-debt-no"
                  onClick={() => {
                    setHasDebt(false);
                    setFormData({ ...formData, debts: [] });
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                    !hasDebt
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  No debt at present
                </button>
              </div>

              {hasDebt && (
                <div className="space-y-4 pt-2">
                  {formData.debts.map((debt, index) => (
                    <div
                      key={debt.id}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-200 relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase text-gray-500">
                          Debt #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDebt(debt.id)}
                          className="text-gray-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-gray-600 mb-1">Debt Type</label>
                          <input
                            type="text"
                            value={debt.type}
                            onChange={(e) => {
                              const updated = [...formData.debts];
                              updated[index].type = e.target.value;
                              setFormData({ ...formData, debts: updated });
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#1A1F2C]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Outstanding Balance</label>
                          <input
                            type="number"
                            value={debt.outstandingBalance}
                            onChange={(e) => {
                              const updated = [...formData.debts];
                              updated[index].outstandingBalance = Number(e.target.value) || 0;
                              setFormData({ ...formData, debts: updated });
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#1A1F2C] font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Interest Rate (% p.a.)</label>
                          <input
                            type="number"
                            value={debt.interestRate}
                            onChange={(e) => {
                              const updated = [...formData.debts];
                              updated[index].interestRate = Number(e.target.value) || 0;
                              setFormData({ ...formData, debts: updated });
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#1A1F2C]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Monthly EMI</label>
                          <input
                            type="number"
                            value={debt.monthlyEmi}
                            onChange={(e) => {
                              const updated = [...formData.debts];
                              updated[index].monthlyEmi = Number(e.target.value) || 0;
                              setFormData({ ...formData, debts: updated });
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#1A1F2C] font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDebt}
                    className="w-full py-2.5 rounded-xl border border-dashed border-gray-300 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Loan / Debt</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: GOALS */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Step 6 — Goals
                </span>
                <h2 className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                  What are you saving toward?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Choose or configure your primary milestones.
                </p>
              </div>

              {/* Goal List */}
              <div className="space-y-3">
                {formData.goals.map((goal, index) => (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1F2C]">{goal.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Target: {formatCurrency(goal.targetAmount, formData.currencySymbol)} • Saved: {formatCurrency(goal.currentAmount, formData.currencySymbol)}
                      </p>
                      <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Due: {goal.targetDate}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => removeGoal(goal.id)}
                        className="text-gray-400 hover:text-rose-600 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add goal pills */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Add a new goal
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableGoalTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addGoal(type)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 text-xs font-medium border border-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: RISK COMFORT */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Step 7 — Risk Comfort
                </span>
                <h2 className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                  How do you feel about market fluctuations?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Simple, beginner-friendly assessment with zero complex jargon.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm font-semibold text-[#1A1F2C] mb-3">
                  "If your investment temporarily fell 10% during a market drop, what would you most likely do?"
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      id: 'sell',
                      label: 'Sell immediately to protect remaining capital',
                      profile: 'Conservative Profile',
                    },
                    {
                      id: 'wait',
                      label: 'Feel concerned but wait and consult my financial plan',
                      profile: 'Moderate Profile (Recommended default)',
                    },
                    {
                      id: 'stay',
                      label: 'Stay invested or invest more because my goal is long-term',
                      profile: 'Growth Profile',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      id={`wizard-risk-${opt.id}`}
                      onClick={() => handleRiskSelection(opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        riskAnswer === opt.id
                          ? 'bg-indigo-50 border-indigo-400 shadow-xs'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-[#1A1F2C]">{opt.label}</p>
                        <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">{opt.profile}</p>
                      </div>
                      {riskAnswer === opt.id && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Resulting Investor Profile: <strong className="font-bold">{formData.riskProfile}</strong>. We'll tailor growth strategies without ever recommending individual stocks or guaranteeing returns.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-[#1A1F2C] transition-colors"
            >
              {step === 1 ? 'Exit' : 'Back'}
            </button>

            <button
              type="button"
              id="wizard-continue-btn"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-2"
            >
              <span>{step === totalSteps ? 'Create My Financial Plan ✨' : 'Continue'}</span>
              {step === totalSteps ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
