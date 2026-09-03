export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type NavigationTab = 'dashboard' | 'save' | 'borrow' | 'grow' | 'goals' | 'insights';

export type IncomeStability = 'Stable' | 'Mostly stable' | 'Variable';

export type RiskProfile = 'Conservative' | 'Moderate' | 'Growth';

export interface DebtItem {
  id: string;
  type: string;
  outstandingBalance: number;
  interestRate: number;
  monthlyEmi: number;
}

export interface GoalItem {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // e.g. "2027-06" or "June 2027"
  monthlyContribution?: number;
  iconName?: string;
}

export interface ExpenseBreakdown {
  // Essential
  housing: number;
  groceries: number;
  utilities: number;
  transport: number;
  healthcare: number;
  education: number;
  insurance: number;
  // Lifestyle
  dining: number;
  shopping: number;
  entertainment: number;
  travel: number;
  subscriptions: number;
  // Other
  other: number;
}

export interface UserProfile {
  name: string;
  ageRange: string;
  currency: Currency;
  currencySymbol: string;
  employmentType: string;
  dependents: number;
  income: {
    monthlyTakeHome: number;
    otherMonthly: number;
    stability: IncomeStability;
  };
  expenses: ExpenseBreakdown;
  savings: {
    accountBalance: number;
    emergencyFund: number;
    emergencyTarget: number;
    currentInvestments: number;
  };
  debts: DebtItem[];
  goals: GoalItem[];
  riskProfile: RiskProfile;
  timeHorizon: string;
  healthScore: number;
  healthScoreChange: number;
}

export interface Recommendation {
  id: string;
  rank: number;
  title: string;
  category: 'SAVE' | 'EMERGENCY' | 'INVEST' | 'DEBT';
  yourSituation: string;
  whatFinwiseNoticed: string;
  recommendedAction: string;
  why: string;
  impact: string;
  potentialImprovement: string;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  ctaLabel: string;
  ctaActionTab: string;
}

export interface SavingsOpportunity {
  id: string;
  category: string;
  current: number;
  suggestedRange: string;
  potentialSaving: number;
  potentialSavingRange: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  why: string;
  annualImpact: number;
  isAddedToPlan?: boolean;
}

export interface LoanSimulation {
  purpose: string;
  amount: number;
  interestRate: number;
  tenureYears: number;
  existingEmi: number;
  estimatedEmi: number;
  totalRepayment: number;
  totalInterest: number;
  fitScore: number;
  fitStatus: 'CAUTION' | 'MANAGEABLE' | 'HIGHER RISK';
  remainingFlexibility: number;
}

export interface MonthlyHistory {
  month: string;
  income: number;
  spending: number;
  savings: number;
  savingsRate: number;
  healthScore: number;
  essentialSpending: number;
  lifestyleSpending: number;
}
