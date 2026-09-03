import React, { useState } from 'react';
import {
  Landmark,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Info,
} from 'lucide-react';
import { UserProfile } from '../../types';
import {
  calculateEMI,
  calculateTotalRepayment,
  calculateTotalInterest,
  assessLoan,
  formatCurrency,
  formatLakh,
  getTotalExpenses,
} from '../../utils/calculations';

interface BorrowViewProps {
  userProfile: UserProfile;
  onOpenAskDrawer?: (query?: string) => void;
}

export const BorrowView: React.FC<BorrowViewProps> = ({ userProfile, onOpenAskDrawer }) => {
  const currencySymbol = userProfile.currencySymbol || '₹';
  const monthlyIncome = userProfile.income.monthlyTakeHome;
  const monthlyExpenses = getTotalExpenses(userProfile.expenses);
  const initialExistingEmi = (userProfile.debts || []).reduce((sum, d) => sum + (d.monthlyEmi || 0), 0);

  // Form Inputs
  const [purpose, setPurpose] = useState('Home Renovation / Auto');
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [existingEmi, setExistingEmi] = useState<number>(initialExistingEmi);

  // Active analysis results
  const estimatedEmi = calculateEMI(loanAmount, interestRate, tenureYears); // ~10,624
  const totalRepayment = calculateTotalRepayment(estimatedEmi, tenureYears); // ~6,37,440
  const totalInterest = calculateTotalInterest(loanAmount, totalRepayment); // ~1,37,440

  const { fitScore, fitStatus, remainingFlexibility } = assessLoan(
    monthlyIncome,
    monthlyExpenses,
    existingEmi,
    estimatedEmi
  );

  // Scenarios for "Can we make this loan easier?"
  // 1. Original
  const originalScenario = {
    title: 'Original Loan',
    borrowed: loanAmount,
    tenure: tenureYears,
    emi: estimatedEmi,
    totalInterest: totalInterest,
    surplusLeft: remainingFlexibility,
  };

  // 2. Longer Tenure (e.g. +2 years)
  const longerTenureYears = tenureYears + 2;
  const longerEmi = calculateEMI(loanAmount, interestRate, longerTenureYears);
  const longerRepay = calculateTotalRepayment(longerEmi, longerTenureYears);
  const longerInterest = calculateTotalInterest(loanAmount, longerRepay);
  const longerSurplus = (monthlyIncome - monthlyExpenses) - longerEmi;

  // 3. Higher Down Payment (borrow 80% e.g. ₹4L instead of ₹5L)
  const lowerPrincipal = Math.round(loanAmount * 0.8);
  const lowerPrincipalEmi = calculateEMI(lowerPrincipal, interestRate, tenureYears);
  const lowerPrincipalRepay = calculateTotalRepayment(lowerPrincipalEmi, tenureYears);
  const lowerPrincipalInterest = calculateTotalInterest(lowerPrincipal, lowerPrincipalRepay);
  const lowerPrincipalSurplus = (monthlyIncome - monthlyExpenses) - lowerPrincipalEmi;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Responsible Credit Analysis
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1F2C] mt-1">
          Borrow
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          See how a loan could affect your finances before you commit. We analyze flexibility, interest burden, and emergency buffers.
        </p>
      </div>

      {/* Main Grid: Analyzer Form & Assessment Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Loan Analyzer Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1F2C]">Loan Parameters</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-600 font-bold uppercase tracking-wider mb-1.5">
                Loan Purpose
              </label>
              <select
                id="borrow-loan-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1A1F2C] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Home Renovation / Auto">Home Renovation / Auto</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Consumer Durable / Gadget">Consumer Durable / Gadget</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-gray-600 font-bold uppercase tracking-wider">
                  Loan Amount
                </label>
                <span className="font-extrabold text-[#1A1F2C] text-sm">
                  {formatCurrency(loanAmount, currencySymbol)}
                </span>
              </div>
              <input
                type="range"
                id="borrow-amount-slider"
                min="50000"
                max="2000000"
                step="25000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹50,000</span>
                <span>₹10,00,000</span>
                <span>₹20,00,000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-bold uppercase tracking-wider mb-1.5">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  id="borrow-interest-rate"
                  step="0.5"
                  min="4"
                  max="28"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1A1F2C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold uppercase tracking-wider mb-1.5">
                  Tenure (Years)
                </label>
                <select
                  id="borrow-tenure-select"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1A1F2C] font-semibold"
                >
                  <option value={1}>1 Year (12 mos)</option>
                  <option value={2}>2 Years (24 mos)</option>
                  <option value={3}>3 Years (36 mos)</option>
                  <option value={4}>4 Years (48 mos)</option>
                  <option value={5}>5 Years (60 mos)</option>
                  <option value={7}>7 Years (84 mos)</option>
                  <option value={10}>10 Years (120 mos)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-bold uppercase tracking-wider mb-1.5">
                Existing Monthly EMI ({currencySymbol})
              </label>
              <input
                type="number"
                id="borrow-existing-emi"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1A1F2C] font-semibold"
              />
              <p className="text-[11px] text-gray-400 mt-1">Current monthly debt payments you already make</p>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Monthly Income:</span>
                <span className="font-semibold text-[#1A1F2C]">{formatCurrency(monthlyIncome, currencySymbol)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Expenses:</span>
                <span className="font-semibold text-[#1A1F2C]">{formatCurrency(monthlyExpenses, currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-gray-200">
                <span>Available Surplus (pre-loan):</span>
                <span>{formatCurrency(monthlyIncome - monthlyExpenses, currencySymbol)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Assessment Results Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            {/* Status & Fit Score Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Loan Assessment
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-[#1A1F2C]">
                    Loan Fit Score: <span className="text-amber-600">{fitScore}</span>
                    <span className="text-sm font-semibold text-gray-400">/100</span>
                  </span>
                </div>
              </div>

              {/* Amber status badge because it's not a guarantee of safety */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs uppercase tracking-wider shadow-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{fitStatus}</span>
              </div>
            </div>

            {/* Core Calculations Readout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-[11px] font-bold uppercase text-gray-500">Estimated EMI</p>
                <p className="text-2xl font-extrabold text-[#1A1F2C] mt-1">
                  {formatCurrency(estimatedEmi, currencySymbol)}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">Per month for {tenureYears} yrs</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-[11px] font-bold uppercase text-gray-500">Total Repayment</p>
                <p className="text-xl font-extrabold text-[#1A1F2C] mt-1">
                  {formatLakh(totalRepayment, currencySymbol)}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">Principal + Interest</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-[11px] font-bold uppercase text-gray-500">Total Interest</p>
                <p className="text-xl font-extrabold text-amber-700 mt-1">
                  {formatLakh(totalInterest, currencySymbol)}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">Borrowing cost over tenure</p>
              </div>
            </div>

            {/* Impact Visualization */}
            <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Monthly Cash Flow Impact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Before */}
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <p className="font-bold text-[#1A1F2C] mb-2">BEFORE NEW LOAN</p>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monthly income:</span>
                      <span className="font-semibold text-[#1A1F2C]">{formatCurrency(monthlyIncome, currencySymbol)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expenses + existing EMI:</span>
                      <span>{formatCurrency(monthlyExpenses, currencySymbol)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-100 font-bold text-emerald-600">
                      <span>Remaining surplus:</span>
                      <span>{formatCurrency(monthlyIncome - monthlyExpenses, currencySymbol)}</span>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <p className="font-bold text-[#1A1F2C] mb-2">AFTER NEW LOAN</p>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>New Loan EMI:</span>
                      <span className="font-semibold text-amber-700">-{formatCurrency(estimatedEmi, currencySymbol)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total debt burden:</span>
                      <span>{formatCurrency(existingEmi + estimatedEmi, currencySymbol)}/mo</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-100 font-extrabold text-[#1A1F2C]">
                      <span>Remaining monthly flexibility:</span>
                      <span className="text-indigo-600 font-extrabold">
                        approx. {formatCurrency(remainingFlexibility, currencySymbol)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assessment Card adhering to safety rules */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-gray-800 leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>✨ FinWise assessment</span>
              </div>
              <p>
                "This loan may be manageable based on the information entered, but it would significantly reduce your monthly flexibility. Consider whether the reduced buffer is comfortable for your situation."
              </p>
              {onOpenAskDrawer && (
                <button
                  type="button"
                  id="borrow-ask-gemini-btn"
                  onClick={() =>
                    onOpenAskDrawer(
                      `Can I afford a loan of ${formatCurrency(loanAmount, currencySymbol)} at ${interestRate}% for ${tenureYears} years with my current monthly surplus?`
                    )
                  }
                  className="mt-3 w-full py-2 px-3 bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>✨ Ask FinWise AI: "Can I afford this loan?"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="text-[11px] text-gray-400 border-t border-gray-100 pt-3 text-center">
            FinWise never guarantees loan approval or absolute safety. Assessments reflect deterministic budget simulations.
          </div>
        </div>
      </div>

      {/* Section: "Can we make this loan easier?" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#1A1F2C]">
              Can we make this loan easier?
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Compare 3 scenario paths to optimize monthly burden versus overall borrowing cost.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Scenario 1: Original */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[#1A1F2C] text-base">Original Loan</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                  Current
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Borrowed Amount:</span>
                  <span className="font-bold text-[#1A1F2C]">{formatLakh(loanAmount, currencySymbol)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Tenure:</span>
                  <span className="font-bold text-[#1A1F2C]">{tenureYears} years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Estimated EMI:</span>
                  <span className="font-extrabold text-[#1A1F2C]">{formatCurrency(estimatedEmi, currencySymbol)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Total Interest:</span>
                  <span className="font-bold text-[#1A1F2C]">{formatLakh(totalInterest, currencySymbol)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Surplus Left:</span>
                  <span className="font-bold text-indigo-600">{formatCurrency(remainingFlexibility, currencySymbol)}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500">
              Standard baseline scenario.
            </div>
          </div>

          {/* Scenario 2: Longer Tenure */}
          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[#1A1F2C] text-base">Longer Tenure</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  Lower EMI
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Borrowed Amount:</span>
                  <span className="font-bold text-[#1A1F2C]">{formatLakh(loanAmount, currencySymbol)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Tenure:</span>
                  <span className="font-bold text-amber-700">{longerTenureYears} years (+2 yrs)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Estimated EMI:</span>
                  <span className="font-extrabold text-emerald-600">
                    {formatCurrency(longerEmi, currencySymbol)} (Save {formatCurrency(estimatedEmi - longerEmi, currencySymbol)}/mo)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Total Interest:</span>
                  <span className="font-bold text-rose-600">{formatLakh(longerInterest, currencySymbol)} (+{formatLakh(longerInterest - totalInterest, currencySymbol)})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Surplus Left:</span>
                  <span className="font-bold text-indigo-600">{formatCurrency(longerSurplus, currencySymbol)}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-snug">
              <strong>Trade-off Warning:</strong> Extending tenure lowers monthly EMI by {formatCurrency(estimatedEmi - longerEmi, currencySymbol)}, but increases total interest by {formatLakh(longerInterest - totalInterest, currencySymbol)}.
            </div>
          </div>

          {/* Scenario 3: Higher Down Payment */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[#1A1F2C] text-base">Higher Down Payment</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Best Value
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Borrowed Amount:</span>
                  <span className="font-bold text-emerald-700">{formatLakh(lowerPrincipal, currencySymbol)} (20% down payment)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Tenure:</span>
                  <span className="font-bold text-[#1A1F2C]">{tenureYears} years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Estimated EMI:</span>
                  <span className="font-extrabold text-emerald-600">{formatCurrency(lowerPrincipalEmi, currencySymbol)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Total Interest:</span>
                  <span className="font-bold text-emerald-700">{formatLakh(lowerPrincipalInterest, currencySymbol)} (-{formatLakh(totalInterest - lowerPrincipalInterest, currencySymbol)})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Surplus Left:</span>
                  <span className="font-bold text-indigo-600">{formatCurrency(lowerPrincipalSurplus, currencySymbol)}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 leading-snug">
              <strong>Optimal Balance:</strong> Contributing a larger initial down payment significantly reduces both monthly EMI and overall lifetime interest.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
