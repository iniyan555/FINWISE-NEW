# FinWise AI 

**Your money. Understood.**

FinWise AI is a financial decision-making assistant built to answer a simple question:

> **“What should I actually do with my money next?”**

Managing money can get confusing pretty quickly. You might know your salary, expenses, savings and loans, but understanding how all of those things affect each other is much harder.

For example, taking a new loan doesn't just mean paying another EMI. It could reduce how much you save every month, slow down your emergency fund, or push one of your goals further away.

That's the problem we wanted FinWise to solve.

Instead of being another expense tracker or financial chatbot, FinWise looks at the bigger picture and helps users understand how their financial decisions affect each other.

---

##  The Problem

There are already plenty of tools for managing money, but most of them solve only one part of the problem.

A budgeting app tells you where your money went.

A loan calculator tells you your EMI.

An investment platform shows you investment options.

Government websites list different schemes.

Insurance platforms help you find policies.

But real financial decisions don't happen separately.

If you take a loan today, does that affect the goal you're saving for?

Should you start investing, or would building your emergency fund make more sense first?

Could cutting a few unnecessary expenses help you reach your goal months earlier?

These are the kinds of questions FinWise is designed to help answer.

---

##  Our Solution

FinWise takes a user's financial information — income, expenses, savings, debts, goals and preferences — and turns it into a clearer financial action plan.

The basic journey is:

**Understand → Save → Protect → Borrow Responsibly → Grow → Achieve**

Instead of throwing a bunch of numbers at the user, FinWise tries to explain:

* where their money is going
* where they may be able to save
* how strong their financial safety net is
* how existing debt is affecting them
* what a new loan could change
* how their financial decisions affect their goals
* when investing may make sense
* what areas of financial protection they may want to look into
* which government benefits may be worth exploring

The idea is simple: **show the user the impact of a decision before they make it.**

---

##  More Than Just a Gemini Chatbot

One thing we wanted to avoid was simply putting an AI chatbot inside a finance dashboard.

Important financial calculations are handled by FinWise's calculation and decision logic first.

Gemini then helps turn those results into explanations that are easier to understand.

```text
User Financial Data
        ↓
Financial Calculation Engine
        ↓
Financial Priority / Decision Engine
        ↓
Financial Context
        ↓
Gemini
        ↓
Simple, Personalized Explanation
        ↓
FinWise Dashboard
```

This way, AI is mainly used for what it is good at — understanding questions and explaining information conversationally — while calculations such as EMI, monthly surplus and savings impact can be handled by application logic.

---

#  Features

##  Dashboard

The dashboard gives users a quick picture of their finances without overwhelming them.

It brings together things like:

* monthly income
* spending
* monthly surplus
* emergency savings
* existing debt
* financial goals
* financial health
* recommended next actions

Instead of just showing numbers, FinWise tries to highlight **what deserves attention next**.

---

##  Save

The Save section looks at spending patterns and helps users identify areas where they may be able to save more.

For example, if shopping, subscriptions or entertainment are taking up a large part of discretionary spending, FinWise can show what reducing those expenses could mean over time.

The goal isn't just to say:

> “Spend less.”

It's to show:

> “If you save ₹1,500 more each month, here's what that could do for your goal.”

---

## 🏦 Borrow

Borrowing decisions can affect much more than the EMI.

FinWise lets users simulate a loan using information such as:

* purchase price
* down payment
* loan amount
* interest rate
* tenure
* existing loans
* existing EMI

It can then calculate and compare things like:

* estimated EMI
* total repayment
* total interest
* remaining monthly surplus
* savings impact
* debt burden
* emergency-fund impact
* impact on financial goals

Instead of simply saying whether a loan is “good” or “bad,” FinWise helps the user understand the trade-offs.

---

##  Compare Loan Scenarios

Users can also experiment with different borrowing scenarios.

For example:

**What if I increase my down payment?**

**What if I borrow less?**

**What if I choose a longer tenure?**

FinWise can compare the effect on EMI, total interest and monthly financial flexibility.

A lower EMI might look attractive, for example, but a longer tenure can also mean paying more interest overall.

The aim is to make those trade-offs easier to see.

---

##  Grow

The Grow section focuses on long-term financial growth.

Rather than jumping straight into investment suggestions, FinWise considers things like:

* risk comfort
* financial goals
* investment horizon
* emergency savings
* existing debt
* available monthly surplus

It then helps users learn about broader investment categories that may be worth exploring.

FinWise focuses on education and diversification rather than trying to predict the “next winning stock.”

---

##  Protect

Growing money is important, but protecting your financial position matters too.

FinWise also helps users think about areas such as:

* health insurance
* life insurance where relevant
* accident/disability protection
* vehicle protection
* property protection
* relevant government-backed protection programs

The goal is to help users notice possible gaps in their financial safety net, not to push a particular insurance product.

---

## 🇮🇳 Government Benefits

Many people may be unaware of government programs that could potentially help them financially.

FinWise can use information such as a user's:

* age
* location
* income range
* employment status
* student status
* dependents
* occupation
* financial goals

to surface government schemes that may be worth checking.

FinWise doesn't claim that someone is definitely eligible. Final eligibility should always be checked through the relevant official government source.

---

##  Goals

FinWise lets users create goals such as:

* buying a laptop
* education
* travel
* buying a vehicle
* building an emergency fund
* other personal financial goals

For each goal, users can track:

* target amount
* amount already saved
* amount remaining
* target date
* monthly contribution needed

The interesting part is that goals are connected to the rest of FinWise.

If you save more, your goal could move closer.

If you take on another EMI, it could move further away.

That's the kind of connection we wanted the app to make visible.

---

##  Ask FinWise

Ask FinWise is our Gemini-powered conversational financial assistant.

Instead of navigating through every section of the app, users can simply ask questions like:

> “What happens if I save ₹5,000 more every month?”

> “How would this loan affect my goals?”

> “Why are you prioritizing my emergency fund?”

> “What part of my finances should I focus on first?”

Gemini receives the user's relevant financial context and helps explain the situation conversationally.

---

##  FinWise Financial Health

FinWise also gives users an easy-to-understand view of their overall financial position.

The Financial Health Score can consider areas such as:

* cash flow
* emergency safety
* debt
* protection
* goal progress
* growth readiness

The purpose isn't to judge someone's finances.

It's simply a quick way of showing which areas are doing well and which areas may need more attention.

**The FinWise Financial Health Score is an educational app metric and is not a credit score.**

---

#  Built With

### Frontend

* React
* TypeScript
* Tailwind CSS
* Recharts
* Lucide Icons

### AI

* Google Gemini API
* Google AI Studio

### Core Logic

* Financial calculation engine
* Financial priority/decision logic
* Gemini-powered explanations
* Responsive web interface

---

#  How We Use Gemini

Gemini gives FinWise its conversational layer.

We use it to help with:

* answering user questions
* explaining financial situations in simpler language
* generating personalized insights
* explaining trade-offs
* summarizing possible next steps

Our goal is not to ask Gemini to blindly make every financial decision.

Where possible, important calculations such as EMI, savings rate, monthly surplus, debt impact and goal requirements are handled by application logic and then passed to the AI for explanation.

---

# Example

Imagine a user has:

```text
Monthly Income: ₹70,000
Monthly Expenses: ₹48,000
Current Savings: ₹60,000
Emergency Fund Target: ₹1,80,000
Goal: ₹1,20,000 Laptop
```

FinWise can calculate their current position and identify things such as:

```text
Monthly Surplus: ₹22,000
Emergency Fund Gap: ₹1,20,000
```

Now suppose the user is considering taking a new loan.

Instead of only showing the EMI, FinWise can help show how that decision may change their:

```text
Monthly Surplus
        ↓
Savings Capacity
        ↓
Emergency Fund Progress
        ↓
Goal Contributions
        ↓
Overall Financial Flexibility
```

So the user gets to see the bigger picture before making the decision.

---

#  Why We Built FinWise

While brainstorming this project, we realized that most financial apps are good at answering questions like:

**“How much did I spend?”**

or

**“What will my EMI be?”**

But the question we found more interesting was:

> **“Considering everything happening with my money, what should I do next?”**

That's what FinWise is trying to explore.

We're building toward a financial assistant where savings, borrowing, protection, investments and goals aren't treated as completely separate decisions.

Because in real life, they aren't.

---

#  What's Next?

There's still a lot we'd love to build.

Some ideas we're exploring include:

* automatic transaction categorization
* bank statement and CSV imports
* recurring expense detection
* a larger verified government-scheme database
* smarter debt planning
* monthly financial reports
* financial habit tracking
* more explainable financial scoring
* longer-term financial planning
* multilingual financial coaching

---

#  Disclaimer

FinWise is built for **financial education and planning**.

It does not guarantee investment returns, loan approval, insurance outcomes, or eligibility for government benefits.

Financial circumstances are different for everyone, investments can gain or lose value, and important financial decisions should be verified using official information or appropriate professional guidance.

---

## FinWise AI

**Understand your money. See the impact. Make a better-informed next move.**
