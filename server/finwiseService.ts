import { GoogleGenAI, Type } from '@google/genai';

export interface ChatHistoryMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export interface FinWiseChatRequest {
  question: string;
  financialContext: Record<string, any>;
  conversationHistory?: ChatHistoryMessage[];
}

export interface FinWiseChatResponse {
  answer: string;
  breakdown: string[];
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Formats the supplied user financial profile into a concise, structured markdown section.
 * Only includes values that actually exist in the profile context.
 */
function formatFinancialContext(ctx: Record<string, any>): string {
  const lines: string[] = [];

  if (ctx.name) lines.push(`- User Name: ${ctx.name}`);
  const symbol = ctx.currencySymbol || '₹';
  const currency = ctx.currency || 'INR';
  lines.push(`- Currency: ${currency} (${symbol})`);

  if (ctx.ageRange) lines.push(`- Age Range: ${ctx.ageRange}`);
  if (ctx.employmentType) lines.push(`- Employment: ${ctx.employmentType}`);
  if (ctx.incomeStability) lines.push(`- Income Stability: ${ctx.incomeStability}`);
  if (ctx.dependents !== undefined) lines.push(`- Dependents: ${ctx.dependents}`);

  if (ctx.monthlyTakeHome !== undefined) {
    lines.push(`- Monthly Take-Home Income: ${symbol}${Number(ctx.monthlyTakeHome).toLocaleString()}`);
  }
  if (ctx.otherMonthlyIncome) {
    lines.push(`- Other Monthly Income: ${symbol}${Number(ctx.otherMonthlyIncome).toLocaleString()}`);
  }
  if (ctx.totalMonthlyIncome !== undefined) {
    lines.push(`- Total Monthly Inflow: ${symbol}${Number(ctx.totalMonthlyIncome).toLocaleString()}`);
  }

  if (ctx.monthlyExpenses) {
    const exp = ctx.monthlyExpenses;
    if (exp.total !== undefined) {
      lines.push(`- Total Monthly Expenses: ${symbol}${Number(exp.total).toLocaleString()}`);
    }
    if (exp.essential !== undefined) {
      lines.push(`  * Essential Expenses: ${symbol}${Number(exp.essential).toLocaleString()}`);
    }
    if (exp.lifestyle !== undefined) {
      lines.push(`  * Lifestyle / Discretionary: ${symbol}${Number(exp.lifestyle).toLocaleString()}`);
    }
    if (exp.other !== undefined && exp.other > 0) {
      lines.push(`  * Other Expenses: ${symbol}${Number(exp.other).toLocaleString()}`);
    }
    if (exp.breakdown && typeof exp.breakdown === 'object') {
      const details = Object.entries(exp.breakdown)
        .filter(([_, val]) => typeof val === 'number' && val > 0)
        .map(([k, val]) => `${k}: ${symbol}${Number(val).toLocaleString()}`)
        .join(', ');
      if (details) {
        lines.push(`  * Expense Categories: ${details}`);
      }
    }
  }

  if (ctx.monthlySurplus !== undefined) {
    lines.push(`- Net Monthly Surplus (Cash buffer after all expenses): ${symbol}${Number(ctx.monthlySurplus).toLocaleString()}`);
  }

  if (ctx.savings) {
    const sav = ctx.savings;
    if (sav.accountBalance !== undefined) {
      lines.push(`- Savings Account Balance: ${symbol}${Number(sav.accountBalance).toLocaleString()}`);
    }
    if (sav.emergencyFund !== undefined) {
      const targetStr = sav.emergencyTarget ? ` (Target: ${symbol}${Number(sav.emergencyTarget).toLocaleString()})` : '';
      const monthsStr = sav.emergencyFundMonthsCovered ? ` (~${sav.emergencyFundMonthsCovered} months coverage)` : '';
      lines.push(`- Emergency Fund: ${symbol}${Number(sav.emergencyFund).toLocaleString()}${targetStr}${monthsStr}`);
    }
    if (sav.currentInvestments !== undefined) {
      lines.push(`- Current Long-term Investments: ${symbol}${Number(sav.currentInvestments).toLocaleString()}`);
    }
  }

  if (ctx.debts) {
    const d = ctx.debts;
    if (d.items && Array.isArray(d.items) && d.items.length > 0) {
      lines.push(`- Existing Debts (${d.items.length}):`);
      d.items.forEach((item: any, i: number) => {
        lines.push(
          `  * #${i + 1} ${item.type || 'Loan'}: Balance ${symbol}${Number(item.outstandingBalance || 0).toLocaleString()}, Interest ${item.interestRate || 0}% p.a., EMI ${symbol}${Number(item.monthlyEmi || 0).toLocaleString()}`
        );
      });
      if (d.totalExistingEmi !== undefined) {
        lines.push(`- Total Current Monthly EMI: ${symbol}${Number(d.totalExistingEmi).toLocaleString()}`);
      }
      if (d.emiToIncomeRatioPercent !== undefined) {
        lines.push(`- EMI-to-Income Ratio: ${d.emiToIncomeRatioPercent}%`);
      }
    } else {
      lines.push(`- Existing Debts: None (No outstanding loans or EMIs)`);
    }
  }

  if (ctx.goals && Array.isArray(ctx.goals) && ctx.goals.length > 0) {
    lines.push(`- User Goals:`);
    ctx.goals.forEach((g: any) => {
      lines.push(
        `  * ${g.title}: Target ${symbol}${Number(g.targetAmount || 0).toLocaleString()}, Saved ${symbol}${Number(g.currentAmount || 0).toLocaleString()}, Target Date ${g.targetDate || 'Flexible'}${g.monthlyContribution ? `, Planned Monthly SIP ${symbol}${Number(g.monthlyContribution).toLocaleString()}` : ''}`
      );
    });
  }

  if (ctx.riskProfile) lines.push(`- Risk Tolerance / Comfort: ${ctx.riskProfile}`);
  if (ctx.financialHealthScore !== undefined) lines.push(`- Current Financial Health Score: ${ctx.financialHealthScore}/100`);

  return lines.join('\n');
}

/**
 * Executes the FinWise Gemini reasoning flow.
 */
export async function handleFinWiseChat(
  request: FinWiseChatRequest
): Promise<FinWiseChatResponse> {
  const { question, financialContext, conversationHistory = [] } = request;

  const ai = getAiClient();
  const contextSummary = formatFinancialContext(financialContext);

  const systemInstruction = `You are FinWise, a friendly, knowledgeable, and educational personal financial coach.

Your core mission:
- Explain financial situations clearly, simply, and objectively.
- Anchor all answers directly to the user's supplied financial context and profile numbers.
- Prioritize building/maintaining a solid emergency fund (3 to 6 months of essential expenses) and tackling high-cost debt where appropriate.
- Explain the real mathematical impact of discretionary spending, saving more, or borrowing on monthly surplus and active goals.
- Discuss investment categories (e.g. diversified low-cost equity index funds, fixed income/debt funds, liquid cash funds) only at a broad educational level.
- Never guarantee investment returns or promise market performance.
- Never recommend individual stocks or speculative assets as guaranteed winners.
- Never claim a loan is "definitely safe" or promise that the user will be approved for a loan.
- Clearly state when information is insufficient to give a definitive answer.
- Avoid inventing or hallucinating financial numbers; strictly use the calculations and profile figures provided below.
- Keep responses concise, supportive, and actionable.

Framing Guidelines:
- For borrowing or new debt questions, use cautious phrasing such as:
  "Based on the information provided..."
  "may be manageable..."
  "could put pressure on your monthly cash flow..."
- For investing questions, explain diversified investment categories and risk rather than giving guaranteed investment advice.
- When answering "Can I afford X?", calculate the impact on their monthly surplus (e.g., how much surplus remains or how many months of surplus it consumes) and note if an emergency cushion is already funded or still needs priority.

USER'S CURRENT FINANCIAL CONTEXT:
${contextSummary || 'No financial profile supplied.'}
`;

  // Build structured contents including limited recent history
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  // Filter and take the last 6 messages
  const recentHistory = conversationHistory.slice(-6);

  for (const msg of recentHistory) {
    if (!msg.text || typeof msg.text !== 'string') continue;
    const role: 'user' | 'model' = msg.sender === 'assistant' ? 'model' : 'user';

    // Avoid starting history with a model turn if it's the very first item
    if (contents.length === 0 && role === 'model') {
      continue;
    }

    // If consecutive roles match, combine text to maintain alternating structure
    const lastEntry = contents[contents.length - 1];
    if (lastEntry && lastEntry.role === role) {
      lastEntry.parts[0].text += `\n${msg.text}`;
    } else {
      contents.push({
        role,
        parts: [{ text: msg.text }],
      });
    }
  }

  // Ensure current question is added as the final user message
  const lastEntry = contents[contents.length - 1];
  if (lastEntry && lastEntry.role === 'user') {
    // If the last history turn was already user, combine or wrap
    lastEntry.parts[0].text += `\n\nCurrent question: ${question}`;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });
  }

  // Call Gemini with primary model and automatic fallback on high demand (503/429)
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let responseText: string | null = null;
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description:
                  'Main conversational response answering the user question clearly and empathetically with educational guidance.',
              },
              breakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description:
                  '2 to 4 concise, actionable bullet points highlighting numbers, cash-flow impacts, or next steps.',
              },
            },
            required: ['answer', 'breakdown'],
          },
          temperature: 0.6,
        },
      });

      if (response.text) {
        responseText = response.text;
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} call failed, trying next candidate:`, err?.message || err);
    }
  }

  if (!responseText) {
    console.error('All Gemini model candidates failed:', lastError?.message || lastError);
    return {
      answer: "I'm having trouble analyzing that right now. Please try again.",
      breakdown: [
        'Our financial reasoning service is currently unavailable. Please verify your connection or try again shortly.',
      ],
    };
  }

  try {
    let parsed: any;
    try {
      parsed = JSON.parse(responseText.trim());
    } catch {
      // Clean possible codeblock wrappers
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      }
      parsed = JSON.parse(cleaned);
    }

    return {
      answer: parsed.answer || 'Here is what your financial profile indicates:',
      breakdown: Array.isArray(parsed.breakdown) ? parsed.breakdown : [],
    };
  } catch (parseError: any) {
    console.error('Failed to parse Gemini response JSON:', parseError?.message || parseError);
    return {
      answer: "I'm having trouble analyzing that right now. Please try again.",
      breakdown: [
        'Our financial reasoning service is currently unavailable. Please verify your connection or try again shortly.',
      ],
    };
  }
}
