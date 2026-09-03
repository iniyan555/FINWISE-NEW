import { ExpenseBreakdown, UserProfile } from '../types';

/**
 * Standard EMI calculation
 * P = Principal loan amount
 * annualRate = Annual interest rate in percent (e.g. 10 for 10%)
 * tenureYears = Tenure in years
 */
export function calculateEMI(principal: number, annualRate: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  if (annualRate <= 0) return Math.round(principal / (tenureYears * 12));

  const monthlyRate = annualRate / 12 / 100;
  const numberOfMonths = tenureYears * 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

  return Math.round(emi);
}

/**
 * Total repayment over loan tenure
 */
export function calculateTotalRepayment(emi: number, tenureYears: number): number {
  return Math.round(emi * tenureYears * 12);
}

/**
 * Total interest paid
 */
export function calculateTotalInterest(principal: number, totalRepayment: number): number {
  return Math.max(0, Math.round(totalRepayment - principal));
}

/**
 * Assess Loan fit score and status based on monthly income, existing expenses, and proposed EMI
 */
export function assessLoan(
  monthlyIncome: number,
  currentExpenses: number,
  existingEmi: number,
  newEmi: number
): { fitScore: number; fitStatus: 'CAUTION' | 'MANAGEABLE' | 'HIGHER RISK'; remainingFlexibility: number } {
  const currentSurplus = monthlyIncome - currentExpenses;
  const remainingFlexibility = currentSurplus - newEmi;
  const totalEmi = existingEmi + newEmi;
  const emiToIncomeRatio = (totalEmi / monthlyIncome) * 100;

  let fitScore = 70;
  let fitStatus: 'CAUTION' | 'MANAGEABLE' | 'HIGHER RISK' = 'CAUTION';

  if (remainingFlexibility <= 0) {
    fitScore = 32;
    fitStatus = 'HIGHER RISK';
  } else if (emiToIncomeRatio > 50 || remainingFlexibility < monthlyIncome * 0.15) {
    fitScore = 52;
    fitStatus = 'HIGHER RISK';
  } else if (emiToIncomeRatio > 35 || remainingFlexibility < monthlyIncome * 0.25) {
    fitScore = 68;
    fitStatus = 'CAUTION';
  } else {
    fitScore = 84;
    fitStatus = 'MANAGEABLE';
  }

  return {
    fitScore,
    fitStatus,
    remainingFlexibility: Math.max(0, remainingFlexibility),
  };
}

/**
 * Sum essential expenses
 */
export function getEssentialExpenses(expenses: ExpenseBreakdown): number {
  return (
    (expenses.housing || 0) +
    (expenses.groceries || 0) +
    (expenses.utilities || 0) +
    (expenses.transport || 0) +
    (expenses.healthcare || 0) +
    (expenses.education || 0) +
    (expenses.insurance || 0)
  );
}

/**
 * Sum lifestyle expenses
 */
export function getLifestyleExpenses(expenses: ExpenseBreakdown): number {
  return (
    (expenses.dining || 0) +
    (expenses.shopping || 0) +
    (expenses.entertainment || 0) +
    (expenses.travel || 0) +
    (expenses.subscriptions || 0)
  );
}

/**
 * Sum all expenses
 */
export function getTotalExpenses(expenses: ExpenseBreakdown): number {
  return getEssentialExpenses(expenses) + getLifestyleExpenses(expenses) + (expenses.other || 0);
}

/**
 * Format currency nicely with Indian numbering (Lakhs/Crores) or standard format
 */
export function formatCurrency(
  amount: number,
  currencySymbol: string = '₹',
  compact: boolean = false
): string {
  if (isNaN(amount)) return `${currencySymbol}0`;

  if (compact && currencySymbol === '₹') {
    if (Math.abs(amount) >= 10000000) {
      return `${currencySymbol}${(amount / 10000000).toFixed(2)}Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `${currencySymbol}${(amount / 100000).toFixed(2)}L`;
    }
  }

  // Standard Indian formatting for INR
  if (currencySymbol === '₹') {
    const isNegative = amount < 0;
    const absVal = Math.abs(Math.round(amount));
    const str = absVal.toString();
    
    let lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${isNegative ? '-' : ''}${currencySymbol}${res}`;
  }

  return `${currencySymbol}${Math.round(amount).toLocaleString()}`;
}

/**
 * Format relative amount in Lakhs e.g. "₹6.37L"
 */
export function formatLakh(amount: number, symbol: string = '₹'): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `${symbol}${lakhs.toFixed(2).replace(/\.00$/, '')}L`;
  }
  return formatCurrency(amount, symbol);
}

/**
 * Calculate months until a target date
 */
export function getMonthsRemaining(targetDateStr: string): number {
  // Try parsing e.g. "June 2027" or "2027-06"
  let targetYear = 2027;
  let targetMonth = 5; // June (0-indexed)

  if (targetDateStr.toLowerCase().includes('2027')) targetYear = 2027;
  if (targetDateStr.toLowerCase().includes('2026')) targetYear = 2026;
  if (targetDateStr.toLowerCase().includes('2028')) targetYear = 2028;
  if (targetDateStr.toLowerCase().includes('2029')) targetYear = 2029;
  if (targetDateStr.toLowerCase().includes('2030')) targetYear = 2030;

  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  monthNames.forEach((name, idx) => {
    if (targetDateStr.toLowerCase().includes(name)) {
      targetMonth = idx;
    }
  });

  const now = new Date(2026, 8, 3); // Sept 2026 (current mock date)
  const diffMonths = (targetYear - now.getFullYear()) * 12 + (targetMonth - now.getMonth());
  return Math.max(1, diffMonths);
}

/**
 * Calculate required monthly contribution for a goal
 */
export function calculateMonthlyGoalContribution(
  targetAmount: number,
  currentAmount: number,
  targetDateStr: string
): number {
  const remaining = Math.max(0, targetAmount - currentAmount);
  const months = getMonthsRemaining(targetDateStr);
  return Math.round(remaining / months);
}
