import React from 'react';
import {
  ShieldCheck,
  PiggyBank,
  Landmark,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { HealthScoreGauge } from '../common/HealthScoreGauge';

interface LandingPageProps {
  onStartOnboarding?: () => void;
  onDirectLogin?: () => void;
  onGetStarted?: () => void;
  onSkipToDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onDirectLogin,
  onGetStarted,
  onSkipToDemo,
}) => {
  const handleStart = onGetStarted || onStartOnboarding || (() => {});
  const handleDemo = onSkipToDemo || onDirectLogin || (() => {});

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1A1F2C] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#1A1F2C]">FinWise</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                AI
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-indigo-600 transition-colors"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-indigo-600 transition-colors"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('disclaimer')}
              className="hover:text-indigo-600 transition-colors"
            >
              Philosophy
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="landing-signin-btn"
              onClick={handleDemo}
              className="text-sm font-semibold text-gray-700 hover:text-[#1A1F2C] px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              id="landing-navbar-cta"
              onClick={handleStart}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Analyze My Finances</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Financial Guidance Without The Jargon</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1F2C] leading-[1.15]">
              Your money. <span className="text-indigo-600">Understood.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              An AI-powered financial coach that helps you spend smarter, borrow responsibly, grow your savings and reach your goals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="hero-primary-cta"
                onClick={handleStart}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>Analyze My Finances</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                type="button"
                id="hero-secondary-cta"
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                No credit card required
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                100% Private & Educational
              </span>
            </div>
          </div>

          {/* Interactive Application Dashboard Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div
              id="hero-dashboard-preview"
              onClick={handleDemo}
              className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 cursor-pointer hover:border-indigo-300 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Live Dashboard Snapshot
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Demo Profile
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1F2C] mt-1">
                    Good morning, Aarav 👋
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-indigo-600 group-hover:underline flex items-center gap-1">
                    Open Live App <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Grid of Preview Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Health Score */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Financial Health
                  </span>
                  <HealthScoreGauge score={74} maxScore={100} change={6} status="GOOD" size="sm" />
                </div>

                {/* Income */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Income
                  </span>
                  <p className="text-2xl font-extrabold text-[#1A1F2C] mt-2">₹70,000</p>
                  <p className="text-xs text-gray-500 mt-1">Salaried take-home</p>
                </div>

                {/* Spending */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Spending
                  </span>
                  <p className="text-2xl font-extrabold text-[#1A1F2C] mt-2">₹48,000</p>
                  <p className="text-xs text-gray-500 mt-1">Essential + Lifestyle</p>
                </div>

                {/* Saved / Monthly Surplus */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Saved (Surplus)
                  </span>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-2">₹22,000</p>
                  <p className="text-xs text-emerald-700 font-medium mt-1">31% monthly savings</p>
                </div>
              </div>

              {/* Potential Extra Savings Callout */}
              <div className="mt-5 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                      Opportunity Detected
                    </p>
                    <p className="text-sm font-semibold text-[#1A1F2C]">
                      Potential extra savings: <span className="text-indigo-700 font-extrabold">₹4,500/month</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 shadow-xs self-start sm:self-auto"
                >
                  Explore Action Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1F2C] mt-2">
              How it works
            </h2>
            <p className="text-gray-600 mt-3 text-sm sm:base">
              A transparent, educational framework designed to put you in complete control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-xs">
                1
              </div>
              <h3 className="font-bold text-lg text-[#1A1F2C] mb-2">Tell us about your money</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter your income, basic expenses, current debts, and savings. No account linking or banking logins required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-xs">
                2
              </div>
              <h3 className="font-bold text-lg text-[#1A1F2C] mb-2">We analyze your financial situation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Deterministic calculations evaluate debt ratios, savings rates, emergency buffer health, and discretionary spending trends.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-xs">
                3
              </div>
              <h3 className="font-bold text-lg text-[#1A1F2C] mb-2">Get a personalized action plan</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive ranked recommendations explaining what to prioritize, why it matters, and the exact financial impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Feature Pillars Section */}
      <section id="features" className="py-16 sm:py-24 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              The Four Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1F2C] mt-2">
              Everything you need to master your money
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* SAVE */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <PiggyBank className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                1. Save
              </span>
              <h3 className="text-lg font-bold text-[#1A1F2C] mt-1 mb-2">Trim Discretionary Waste</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Find unnecessary spending and discover realistic ways to save more without cutting essential comforts.
              </p>
            </div>

            {/* BORROW */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                2. Borrow
              </span>
              <h3 className="text-lg font-bold text-[#1A1F2C] mt-1 mb-2">Loan Risk Analyzer</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Understand how a loan could affect your monthly finances before committing. Compare tenures and trade-offs.
              </p>
            </div>

            {/* GROW */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                3. Grow
              </span>
              <h3 className="text-lg font-bold text-[#1A1F2C] mt-1 mb-2">Sensible Education</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explore diversified ways to put your savings to work based on your goals and risk comfort — no stock picking or hype.
              </p>
            </div>

            {/* ACHIEVE / GOALS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                4. Achieve
              </span>
              <h3 className="text-lg font-bold text-[#1A1F2C] mt-1 mb-2">Goal Roadmaps</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Turn financial goals into realistic monthly plans. Link savings directly to timelines with target simulators.
              </p>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-14 bg-white rounded-3xl p-8 border border-gray-200 text-center max-w-3xl mx-auto shadow-xs">
            <h3 className="text-2xl font-bold text-[#1A1F2C]">Ready to take control of your money?</h3>
            <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">
              Get an instant personal assessment with realistic recommendations in under 3 minutes.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                id="bottom-banner-onboarding-cta"
                onClick={handleStart}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Analyze My Finances</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="bottom-banner-demo-cta"
                onClick={handleDemo}
                className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
              >
                Launch Demo Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tasteful Footer Disclaimer */}
      <footer id="disclaimer" className="mt-auto bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-[#1A1F2C]">FinWise AI</span>
            </div>
            <p className="text-xs text-gray-500 text-center sm:text-right">
              Built for clarity, trust, and practical financial well-being.
            </p>
          </div>

          <div className="pt-6">
            <p className="text-xs text-gray-400 text-center max-w-3xl mx-auto leading-relaxed">
              FinWise AI is designed for financial education and planning. Estimates depend on the information provided. Investments involve risk and returns are not guaranteed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
