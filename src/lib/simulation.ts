// src/lib/simulation.ts
import { HISTORICAL_DATA } from './constants';

// Define a type for our simulation results for type safety
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
  let withdrawal = annualWithdrawal;
  
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  
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
    
    portfolio *= (1 + weightedReturn);
    
    if (i < incomeYears) {
      portfolio += (annualIncome - withdrawal);
    } else {
      portfolio -= withdrawal;
    }
    
    portfolio = Math.max(0, portfolio);
    portfolioValues.push(portfolio);
    
    if (inflationAdj) {
      withdrawal *= 1.02;
    }

    if (portfolio <= 0) {
      const remaining = years.length - (i + 1);
      if (remaining > 0) {
        portfolioValues.push(...Array(remaining).fill(0));
        annualReturns.push(...Array(remaining).fill(0));
      }
      break;
    }
  }

  // Calculate Summary Metrics
  const finalValue = portfolioValues[portfolioValues.length - 1] ?? 0;
  
  let peak = Math.max(startCapital, ...portfolioValues);
  let maxDrawdown = 0;
  portfolioValues.forEach(value => {
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });
  
  const avgReturn = annualReturns.reduce((a, b) => a + b, 0) / annualReturns.length;
  const volatility = Math.sqrt(annualReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / annualReturns.length);
  const yearsLasted = portfolioValues.findIndex(v => v <= 0);

  return {
    portfolioValues,
    annualReturns,
    summary: {
      "Final Value": finalValue,
      "Max Drawdown": `${(maxDrawdown * 100).toFixed(1)}%`,
      "Volatility": `${(volatility * 100).toFixed(1)}%`,
      "Years Lasted": yearsLasted === -1 ? `${years.length}/${years.length}` : `${yearsLasted}/${years.length}`,
      "Success": finalValue > 0 ? "100%" : "0%",
    },
    allocation
  };
};