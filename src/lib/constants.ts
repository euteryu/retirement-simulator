// src/lib/constants.ts

export const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f16d3a', '#10b981'];
export const ASSET_COLORS: Record<string, string> = {
  stocks: '#6366f1',
  bonds: '#8b5cf6',
  etf: '#ec4899',
  reits: '#f43f5e',
  cash: '#f16d3a'
};

export const HISTORICAL_DATA: Record<string, Record<number, number>> = {
  stocks: { 1990: -0.06, 1991: 0.29, /* ... rest of data */ 2025: 0.07 },
  bonds: { 1990: 0.035, 1991: 0.041, /* ... rest of data */ 2025: 0.025 },
  etf: { 1990: -0.04, 1991: 0.21, /* ... rest of data */ 2025: 0.06 },
  reits: { 1990: 0.02, 1991: 0.15, /* ... rest of data */ 2025: 0.08 },
  cash: { 1990: 0.045, 1991: 0.041, /* ... rest of data */ 2025: 0.001 },
};
// Make sure to paste the full data objects here

export const PRESET_STRATEGIES: Record<string, Record<string, number>> = {
  "🚀 Aggressive Growth": { stocks: 0.70, bonds: 0.05, etf: 0.20, reits: 0.05, cash: 0.00 },
  "📈 Growth": { stocks: 0.60, bonds: 0.15, etf: 0.15, reits: 0.05, cash: 0.05 },
  "⚖️ Balanced Growth": { stocks: 0.50, bonds: 0.20, etf: 0.15, reits: 0.05, cash: 0.10 },
  "🎯 Target Date 2040": { stocks: 0.45, bonds: 0.25, etf: 0.15, reits: 0.05, cash: 0.10 },
  "🌍 Global Diversified": { stocks: 0.35, bonds: 0.25, etf: 0.20, reits: 0.05, cash: 0.15 },
  "🛡️ Conservative": { stocks: 0.20, bonds: 0.30, etf: 0.15, reits: 0.05, cash: 0.30 },
  "🏦 Income Focus": { stocks: 0.15, bonds: 0.35, etf: 0.10, reits: 0.05, cash: 0.35 },
  "💤 Capital Preservation": { stocks: 0.10, bonds: 0.30, etf: 0.10, reits: 0.00, cash: 0.50 },
  "🏠 Real Estate Heavy": { stocks: 0.25, bonds: 0.20, etf: 0.10, reits: 0.25, cash: 0.20 },
  "💸 Cash Heavy": { stocks: 0.05, bonds: 0.15, etf: 0.05, reits: 0.05, cash: 0.70 },
  "💰 Cash Only": { stocks: 0.00, bonds: 0.00, etf: 0.00, reits: 0.00, cash: 1.00 },
};

export const SCENARIO_PRESETS = {
  "Conservative Retiree": {
    startCapital: 200000,
    annualWithdrawal: 8000,
    strategies: ["🛡️ Conservative", "💰 Cash Only"],
    description: "Lower risk, steady income - ideal for risk-averse retirees"
  },
  "Moderate Growth": {
    startCapital: 150000,
    annualWithdrawal: 6000,
    strategies: ["⚖️ Balanced Growth", "🎯 Target Date 2040"],
    description: "Balanced risk/reward - good for long-term growth"
  },
  "Aggressive Growth": {
    startCapital: 100000,
    annualWithdrawal: 4000,
    strategies: ["🚀 Aggressive Growth", "📈 Growth"],
    description: "Higher risk, higher potential returns - for growth-focused investors"
  }
};