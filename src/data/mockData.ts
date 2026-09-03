import {
  UserProfile,
  Recommendation,
  SavingsOpportunity,
  MonthlyHistory,
} from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Aarav',
  ageRange: '26–35',
  currency: 'INR',
  currencySymbol: '₹',
  employmentType: 'Salaried Professional',
  dependents: 0,
  income: {
    monthlyTakeHome: 70000,
    otherMonthly: 0,
    stability: 'Stable',
  },
  expenses: {
    // Essential (₹30,000)
    housing: 15000,
    groceries: 7000,
    transport: 4000,
    utilities: 4000,
    healthcare: 0,
    education: 0,
    insurance: 0,
    // Lifestyle (₹12,000)
    dining: 0,
    shopping: 7000,
    entertainment: 5000,
    travel: 0,
    subscriptions: 3000, // listed in prompt as separate category ₹3,000
    // Other (₹3,000)
    other: 3000,
  },
  savings: {
    accountBalance: 60000,
    emergencyFund: 60000,
    emergencyTarget: 180000,
    currentInvestments: 25000,
  },
  debts: [
    {
      id: 'debt-1',
      type: 'Personal Loan',
      outstandingBalance: 120000,
      interestRate: 11.5,
      monthlyEmi: 5000,
    },
  ],
  goals: [
    {
      id: 'goal-emergency',
      title: 'Emergency Fund',
      category: 'Safety',
      targetAmount: 180000,
      currentAmount: 60000,
      targetDate: 'December 2026',
      iconName: 'ShieldCheck',
    },
    {
      id: 'goal-laptop',
      title: 'Laptop / Tech Setup',
      category: 'Electronics',
      targetAmount: 120000,
      currentAmount: 60000,
      targetDate: 'June 2027',
      iconName: 'Laptop',
    },
    {
      id: 'goal-travel',
      title: 'Japan Travel Trip',
      category: 'Travel',
      targetAmount: 80000,
      currentAmount: 20000,
      targetDate: 'March 2027',
      iconName: 'Plane',
    },
  ],
  riskProfile: 'Moderate',
  timeHorizon: '8+ years',
  healthScore: 74,
  healthScoreChange: 6,
};

export const defaultRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    rank: 1,
    title: 'Reduce lifestyle spending',
    category: 'SAVE',
    yourSituation: 'Shopping & entertainment currently total ₹12,000/month (25% of all spending).',
    whatFinwiseNoticed: 'Discretionary retail and leisure purchases increased by ₹2,300 compared to your baseline.',
    recommendedAction: 'Trim discretionary shopping by ₹1,500 and entertainment by ₹1,000 each month.',
    why: 'This provides an instant surplus boost without compromising your essential living expenses or rent.',
    impact: 'Redirects +₹2,500/month (+₹30,000/year) directly into your emergency reserve and laptop goals.',
    potentialImprovement: '+₹2,500/month',
    difficulty: 'Easy',
    ctaLabel: 'See Savings Opportunities',
    ctaActionTab: 'save',
  },
  {
    id: 'rec-2',
    rank: 2,
    title: 'Continue building your emergency fund',
    category: 'EMERGENCY',
    yourSituation: 'You currently have ₹60,000 in your liquid emergency buffer.',
    whatFinwiseNoticed: 'Your target is ₹1,80,000 (approx. 4 months of essential expenses), leaving ₹1,20,000 remaining.',
    recommendedAction: 'Allocate ₹4,000 to ₹5,000 of your monthly surplus to reach your safety cushion safely.',
    why: 'A solid emergency fund prevents you from taking high-interest debt or liquidating investments during unexpected events.',
    impact: 'Protects your financial foundation and allows stress-free long-term wealth building.',
    potentialImprovement: '₹1,20,000 remaining',
    difficulty: 'Moderate',
    ctaLabel: 'View Emergency Plan',
    ctaActionTab: 'goals',
  },
  {
    id: 'rec-3',
    rank: 3,
    title: 'Prepare to invest ₹5,000/month',
    category: 'INVEST',
    yourSituation: 'You have a healthy ₹22,000 monthly surplus and moderate risk tolerance.',
    whatFinwiseNoticed: 'Long-term compounding works best once short-term debt and emergency funds are stabilized.',
    recommendedAction: 'Unlock a systematic ₹5,000/month allocation to broad-market diversified funds once emergency buffer hits ₹1.2L.',
    why: 'Diversified index strategies help beat inflation over your 8+ year horizon without single-stock risk.',
    impact: 'Estimated to accumulate substantial long-term wealth systematically while keeping debt manageable.',
    potentialImprovement: 'Unlock after buffer',
    difficulty: 'Moderate',
    ctaLabel: 'Explore Investment Types',
    ctaActionTab: 'grow',
  },
];

export const savingsOpportunitiesData: SavingsOpportunity[] = [
  {
    id: 'save-shopping',
    category: 'Shopping',
    current: 7000,
    suggestedRange: '₹5,000–₹5,500',
    potentialSaving: 1750,
    potentialSavingRange: '₹1,500–₹2,000/month',
    difficulty: 'Easy',
    why: 'Shopping is one of your largest discretionary categories. A moderate reduction could redirect approximately ₹18,000–₹24,000 per year toward your financial goals.',
    annualImpact: 21000,
    isAddedToPlan: false,
  },
  {
    id: 'save-entertainment',
    category: 'Entertainment',
    current: 5000,
    suggestedRange: '₹3,800',
    potentialSaving: 1200,
    potentialSavingRange: '₹1,200/month',
    difficulty: 'Easy',
    why: 'Weekend outings and impulse leisure bookings can be planned more deliberately with pre-allocated allowances.',
    annualImpact: 14400,
    isAddedToPlan: false,
  },
  {
    id: 'save-subscriptions',
    category: 'Subscriptions',
    current: 3000,
    suggestedRange: '₹2,200',
    potentialSaving: 800,
    potentialSavingRange: '₹800/month',
    difficulty: 'Easy',
    why: 'You have 4 active digital streaming and gym memberships with duplicate library services.',
    annualImpact: 9600,
    isAddedToPlan: false,
  },
];

export const historicalData: MonthlyHistory[] = [
  {
    month: 'Apr',
    income: 70000,
    spending: 53000,
    savings: 17000,
    savingsRate: 24,
    healthScore: 68,
    essentialSpending: 30000,
    lifestyleSpending: 16000,
  },
  {
    month: 'May',
    income: 70000,
    spending: 51000,
    savings: 19000,
    savingsRate: 27,
    healthScore: 70,
    essentialSpending: 30000,
    lifestyleSpending: 15000,
  },
  {
    month: 'Jun',
    income: 70000,
    spending: 50000,
    savings: 20000,
    savingsRate: 28,
    healthScore: 71,
    essentialSpending: 30000,
    lifestyleSpending: 14000,
  },
  {
    month: 'Jul',
    income: 70000,
    spending: 49000,
    savings: 21000,
    savingsRate: 30,
    healthScore: 72,
    essentialSpending: 30000,
    lifestyleSpending: 13000,
  },
  {
    month: 'Aug',
    income: 70000,
    spending: 49500,
    savings: 20500,
    savingsRate: 29,
    healthScore: 72,
    essentialSpending: 30000,
    lifestyleSpending: 13500,
  },
  {
    month: 'Sep',
    income: 70000,
    spending: 48000,
    savings: 22000,
    savingsRate: 31,
    healthScore: 74,
    essentialSpending: 30000,
    lifestyleSpending: 12000,
  },
];

export const educationalInvestmentData = [
  {
    id: 'index-funds',
    title: 'Broad-Market Index Funds',
    riskLevel: 'Moderate',
    riskColor: 'blue',
    typicalUse: 'Long-term wealth building (5+ years)',
    diversification: 'Very High',
    description:
      'Funds designed to track a broad market index, spreading exposure across hundreds of established companies instead of relying on individual stock selection.',
    keyPoints: [
      'Passively tracks broad benchmarks (e.g., Nifty 50, S&P 500).',
      'Ultra-low expense ratio compared to actively managed portfolios.',
      'Eliminates company-specific bankruptcy risk through broad diversification.',
      'Ideal for patient investors willing to withstand temporary market cycles.',
    ],
    exampleAllocation: '40% - 60% of growth portfolio',
  },
  {
    id: 'mutual-funds',
    title: 'Diversified Mutual Funds',
    riskLevel: 'Varies by Fund',
    riskColor: 'amber',
    typicalUse: 'Medium to long-term goals (3 to 7 years)',
    diversification: 'High',
    description:
      'Professionally managed funds that spread investments across multiple assets or securities based on a stated mandate.',
    keyPoints: [
      'Active portfolio managers rebalance holdings based on market conditions.',
      'Available across large-cap, multi-cap, and hybrid asset allocation styles.',
      'Higher expense ratios than pure index funds, with manager oversight.',
      'Suited for investors looking for guided diversification across sectors.',
    ],
    exampleAllocation: '20% - 30% of growth portfolio',
  },
  {
    id: 'fixed-income',
    title: 'Fixed-Income / Lower-Volatility Options',
    riskLevel: 'Lower Relative Market Risk',
    riskColor: 'emerald',
    typicalUse: 'Shorter-term or conservative milestones (1 to 3 years)',
    diversification: 'Moderate to High',
    description:
      'Instruments such as government treasury bills, high-quality corporate debt funds, or fixed deposits prioritizing capital preservation over aggressive growth.',
    keyPoints: [
      'Predictable yield with lower fluctuations than equity markets.',
      'Excellent parking vehicle for funds needed within 1–3 years.',
      'Helps stabilize portfolio value during broad stock market downturns.',
      'Return may only slightly match or trail inflation over extended decades.',
    ],
    exampleAllocation: '15% - 25% of growth portfolio',
  },
];

export const mockAiResponses: Record<string, { answer: string; breakdown: string[] }> = {
  'Can I afford a ₹20,000 phone this month?': {
    answer:
      'Based on your numbers, paying ₹20,000 upfront in cash this month would use nearly 91% of your current ₹22,000 surplus, leaving only ₹2,000 for unexpected expenses.',
    breakdown: [
      'Your monthly surplus is ₹22,000.',
      'Your current liquid emergency fund (₹60,000) is still ₹1,20,000 short of its target.',
      'Recommendation: Set up a dedicated "Tech Upgrade" goal of saving ₹5,000/month for 4 months, or wait until your emergency buffer reaches ₹1,00,000.',
    ],
  },
  'Why are you asking me to build my emergency fund first?': {
    answer:
      'Emergency reserves are your financial shock absorber. Without at least 3–6 months of living expenses safely stored, any unforeseen bill forces you into high-interest debt or premature investment liquidation.',
    breakdown: [
      'Your monthly essential expenses are ₹30,000.',
      'A 6-month buffer requires ₹1,80,000; you currently hold ₹60,000 (2 months).',
      'Stock markets fluctuate. Having liquid reserves ensures you never have to sell investments during a market dip.',
    ],
  },
  'What happens if I save ₹3,000 more every month?': {
    answer:
      'Increasing your monthly savings from ₹22,000 to ₹25,000 raises your savings rate from 31% to 35.7%, accelerating all your financial milestones significantly.',
    breakdown: [
      '1 Year: An extra ₹36,000 saved, reaching ₹3,00,000 total annual surplus.',
      'Emergency Fund: Your remaining ₹1,20,000 gap will be closed 6 months sooner.',
      'Your Laptop goal (₹60,000 remaining) could be funded in 12 months instead of 18 months.',
    ],
  },
  'How would this loan affect my laptop goal?': {
    answer:
      'Taking the proposed ₹5,00,000 loan would introduce a ₹10,624 monthly EMI, cutting your monthly surplus from ₹22,000 down to ₹11,376.',
    breakdown: [
      'Your laptop goal requires ₹1,333/month to reach ₹1,20,000 by June 2027.',
      'While the ₹11,376 remaining surplus can still cover the ₹1,333 EMI, your buffer for surprise medical or vehicle costs drops from ₹22,000 to just ₹10,043.',
      'You would have less flexibility to accelerate the goal date.',
    ],
  },
};
