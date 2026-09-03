import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, HelpCircle } from 'lucide-react';
import { UserProfile } from '../../types';
import { getTotalExpenses, getEssentialExpenses, getLifestyleExpenses, formatCurrency } from '../../utils/calculations';

interface AskFinWiseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  initialQuery?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  breakdown?: string[];
  timestamp: string;
}

/**
 * Builds a clean, dynamic financial context object based strictly on actual UserProfile values.
 */
function buildFinancialContext(profile: UserProfile): Record<string, any> {
  const totalExpenses = getTotalExpenses(profile.expenses);
  const essentialExpenses = getEssentialExpenses(profile.expenses);
  const lifestyleExpenses = getLifestyleExpenses(profile.expenses);
  const totalIncome = (profile.income?.monthlyTakeHome || 0) + (profile.income?.otherMonthly || 0);
  const monthlySurplus = totalIncome - totalExpenses;
  const existingDebts = profile.debts || [];
  const totalExistingEmi = existingDebts.reduce((sum, d) => sum + (d.monthlyEmi || 0), 0);
  const totalDebtBalance = existingDebts.reduce((sum, d) => sum + (d.outstandingBalance || 0), 0);

  const context: Record<string, any> = {};

  if (profile.name) context.name = profile.name;
  if (profile.currency) context.currency = profile.currency;
  if (profile.currencySymbol) context.currencySymbol = profile.currencySymbol;
  if (profile.ageRange) context.ageRange = profile.ageRange;
  if (profile.employmentType) context.employmentType = profile.employmentType;
  if (profile.dependents !== undefined) context.dependents = profile.dependents;

  if (profile.income) {
    context.monthlyTakeHome = profile.income.monthlyTakeHome;
    if (profile.income.otherMonthly) context.otherMonthlyIncome = profile.income.otherMonthly;
    if (profile.income.stability) context.incomeStability = profile.income.stability;
    context.totalMonthlyIncome = totalIncome;
  }

  context.monthlyExpenses = {
    total: totalExpenses,
    essential: essentialExpenses,
    lifestyle: lifestyleExpenses,
    other: profile.expenses?.other ?? 0,
    breakdown: profile.expenses,
  };

  context.monthlySurplus = monthlySurplus;

  if (profile.savings) {
    context.savings = {
      accountBalance: profile.savings.accountBalance,
      emergencyFund: profile.savings.emergencyFund,
      emergencyTarget: profile.savings.emergencyTarget,
      currentInvestments: profile.savings.currentInvestments,
      emergencyFundMonthsCovered:
        essentialExpenses > 0 ? Number((profile.savings.emergencyFund / essentialExpenses).toFixed(1)) : 0,
    };
  }

  if (existingDebts.length > 0) {
    context.debts = {
      items: existingDebts.map((d) => ({
        type: d.type,
        outstandingBalance: d.outstandingBalance,
        interestRate: d.interestRate,
        monthlyEmi: d.monthlyEmi,
      })),
      totalExistingEmi,
      totalDebtBalance,
      emiToIncomeRatioPercent: totalIncome > 0 ? Number(((totalExistingEmi / totalIncome) * 100).toFixed(1)) : 0,
    };
  } else {
    context.debts = {
      items: [],
      totalExistingEmi: 0,
      totalDebtBalance: 0,
      emiToIncomeRatioPercent: 0,
    };
  }

  if (profile.goals && profile.goals.length > 0) {
    context.goals = profile.goals.map((g) => ({
      title: g.title,
      category: g.category,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      targetDate: g.targetDate,
      monthlyContribution: g.monthlyContribution,
    }));
  }

  if (profile.riskProfile) context.riskProfile = profile.riskProfile;
  if (profile.timeHorizon) context.timeHorizon = profile.timeHorizon;
  if (profile.healthScore !== undefined) context.financialHealthScore = profile.healthScore;

  return context;
}

export const AskFinWiseDrawer: React.FC<AskFinWiseDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  initialQuery,
}) => {
  const currencySymbol = userProfile.currencySymbol || '₹';
  const totalExpenses = getTotalExpenses(userProfile.expenses);
  const monthlySurplus = (userProfile.income?.monthlyTakeHome || 0) - totalExpenses;

  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hi ${userProfile.name}! I'm FinWise, your personal financial coach. I have full context on your ${formatCurrency(userProfile.income.monthlyTakeHome, currencySymbol)} monthly income, ${formatCurrency(monthlySurplus, currencySymbol)} surplus, and ongoing goals. How can I help you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
    }
  }, [initialQuery]);

  const suggestedQuestions = [
    `Can I afford a ${currencySymbol}20,000 phone this month?`,
    'Why are you asking me to build my emergency fund first?',
    `What happens if I save ${currencySymbol}3,000 more every month?`,
    'How would this loan affect my laptop goal?',
  ];

  const handleSendQuestion = async (questionText: string) => {
    if (!questionText.trim() || isThinking) return;

    const trimmedQuestion = questionText.trim();
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmedQuestion,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const financialContext = buildFinancialContext(userProfile);

      // Pass limited recent history (excluding welcome message, max 6 messages)
      const recentHistory = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      const response = await fetch('/api/finwise-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          financialContext,
          conversationHistory: recentHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || "I'm having trouble analyzing that right now. Please try again.",
        breakdown: Array.isArray(data.breakdown) && data.breakdown.length > 0 ? data.breakdown : undefined,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Error contacting FinWise assistant:', error);
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "I'm having trouble analyzing that right now. Please try again.",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-xs transition-opacity">
      <div
        id="ask-finwise-drawer"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1A1F2C] text-base flex items-center gap-1.5">
                Ask FinWise
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Assistant
                </span>
              </h3>
              <p className="text-xs text-gray-500">Ask questions about your financial plan</p>
            </div>
          </div>
          <button
            type="button"
            id="close-finwise-drawer"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-gray-100 text-[#1A1F2C] rounded-tl-xs border border-gray-200/60'
                }`}
              >
                <p className="font-normal">{msg.text}</p>
                {msg.breakdown && (
                  <div className="mt-3 pt-2.5 border-t border-gray-200 space-y-1.5 text-xs text-gray-700">
                    {msg.breakdown.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#1A1F2C] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 justify-start items-center text-xs text-gray-500">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-xl px-3 py-2 flex items-center gap-1.5 border border-gray-200/60">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium text-gray-600">
                  FinWise is analyzing...
                </span>
              </div>
            </div>
          )}

          {/* Suggested Prompts */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Suggested questions
            </p>
            <div className="flex flex-col gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`suggested-q-${idx}`}
                  disabled={isThinking}
                  onClick={() => handleSendQuestion(q)}
                  className="text-left text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 rounded-xl px-3 py-2 text-gray-700 transition-colors flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="finwise-query-input"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about your budget, loans, or goals..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1A1F2C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              id="send-finwise-query"
              disabled={!inputQuery.trim() || isThinking}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            FinWise is designed for financial education and planning. Estimates depend on the information provided.
          </p>
        </div>
      </div>
    </div>
  );
};
