// src/lib/simulation.ts
import { HISTORICAL_DATA } from './constants';

export interface SimulationResult {
  portfolioValues: number[];
  annualReturns: number[];
  summary: Record<string, number | string>;
  allocation: Record<string, number>;
}

export const simulatePortfolio = (
  startYear: number,
  endYear: number,
  startCapital: number,
  annualWithdrawal: number,
  inflationAdj: boolean,
  allocation: Record<string, number>,
  annualIncome: number,
  incomeYears: number,
  marketShock?: { yearIndex: number; severity: number }
): SimulationResult => {
  const portfolioValues: number[] = [];
  const annualReturns: number[] = [];
  let portfolio = startCapital;
  let currentWithdrawal = annualWithdrawal;
  
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  let totalWithdrawn = 0;

  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    
    let stockR = HISTORICAL_DATA.stocks[year] ?? 0;
    let bondR = HISTORICAL_DATA.bonds[year] ?? 0;
    let etfR = HISTORICAL_DATA.etf[year] ?? 0;
    let reitR = HISTORICAL_DATA.reits[year] ?? 0;
    const cashR = HISTORICAL_DATA.cash[year] ?? 0;
    
    if (marketShock && i === marketShock.yearIndex) {
      const shockMultiplier = 1 + marketShock.severity;
      stockR *= shockMultiplier;
      bondR *= shockMultiplier * 0.5;
      etfR *= shockMultiplier;
      reitR *= shockMultiplier * 0.8;
    }

    const weightedReturn =
      (allocation.stocks * stockR) +
      (allocation.bonds * bondR) +
      (allocation.etf * etfR) +
      (allocation.reits * reitR) +
      (allocation.cash * cashR);
    
    annualReturns.push(weightedReturn);
    
    // Apply returns at the beginning of the year
    portfolio *= (1 + weightedReturn);
    
    // Handle cashflow
    let effectiveWithdrawal = 0;
    if (i < incomeYears) {
      const netCashflow = annualIncome - currentWithdrawal;
      portfolio += netCashflow;
      effectiveWithdrawal = currentWithdrawal; // We still count this as "withdrawn" for living expenses
    } else {
      portfolio -= currentWithdrawal;
      effectiveWithdrawal = currentWithdrawal;
    }
    
    // Portfolio can't be negative, but withdrawals still count
    if (portfolio < 0) {
        // If portfolio went from positive to negative, you only got what was left
        const lastPositiveValue = portfolioValues.length > 0 ? portfolioValues[portfolioValues.length - 1] * (1 + weightedReturn) : startCapital * (1 + weightedReturn);
        totalWithdrawn += Math.max(0, lastPositiveValue);
        portfolio = 0;
    } else {
        totalWithdrawn += effectiveWithdrawal;
    }
    
    portfolioValues.push(portfolio);
    
    if (inflationAdj) {
      currentWithdrawal *= 1.02;
    }

    if (portfolio === 0) {
      const remaining = years.length - (i + 1);
      if (remaining > 0) {
        portfolioValues.push(...Array(remaining).fill(0));
        annualReturns.push(...Array(remaining).fill(0));
      }
      break;
    }
  }

  // --- More Accurate Metrics Calculation ---
  const finalValue = portfolioValues[portfolioValues.length - 1] ?? 0;
  
  let peak = startCapital;
  let maxDrawdown = 0;
  portfolioValues.forEach(value => {
    if(value > peak) peak = value;
    const drawdown = peak > 0 ? (peak - value) / peak : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });
  
  const avgReturn = annualReturns.reduce((a, b) => a + b, 0) / annualReturns.length;
  const volatility = Math.sqrt(annualReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / annualReturns.length);
  
  const yearsLastedIndex = portfolioValues.findIndex(v => v === 0);
  const yearsLasted = yearsLastedIndex === -1 ? years.length : yearsLastedIndex + 1;

  return {
    portfolioValues,
    annualReturns,
    summary: {
      "Final Value": finalValue,
      "Total Withdrawn": totalWithdrawn,
      "Max Drawdown": `${(maxDrawdown * 100).toFixed(1)}%`,
      "Volatility (Std. Dev)": `${(volatility * 100).toFixed(1)}%`,
      "Years Lasted": `${yearsLasted}/${years.length}`,
      "Success": finalValue > 0 ? "100%" : "0%",
    },
    allocation
  };
};