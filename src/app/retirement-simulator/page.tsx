// src/app/retirement-simulator/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PRESET_STRATEGIES } from '@/lib/constants';
import { simulatePortfolio, SimulationResult } from '@/lib/simulation';
import { SimulatorControls } from '@/components/simulator/SimulatorControls';
import { PerformanceCharts } from '@/components/simulator/PerformanceCharts';
import { AllocationCharts } from '@/components/simulator/AllocationCharts';
import { MetricsTable } from '@/components/simulator/MetricsTable';
import { EducationSection } from '@/components/simulator/EducationSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define a type for our settings state
export interface SimulationSettings {
  startYear: number;
  endYear: number;
  startCapital: number;
  annualWithdrawal: number;
  annualIncome: number;
  incomeYears: number;
  inflationAdj: boolean;
  selectedStrategies: string[];
  simulateShock: boolean;
  shockYear: number;
  shockSeverity: number;
}

export default function RetirementSimulatorPage() {
  const [settings, setSettings] = useState<SimulationSettings>({
    startYear: 2000,
    endYear: 2025,
    startCapital: 100000,
    annualWithdrawal: 4000,
    annualIncome: 0,
    incomeYears: 0,
    inflationAdj: true,
    selectedStrategies: ["⚖️ Balanced Growth", "💰 Cash Only"],
    simulateShock: false,
    shockYear: 5,
    shockSeverity: -0.3,
  });

  const [results, setResults] = useState<Record<string, SimulationResult>>({});

  // Re-run simulation when settings change
  useEffect(() => {
    const simulationResults: Record<string, SimulationResult> = {};
    if (settings.selectedStrategies.length === 0) {
      setResults({});
      return;
    }

    settings.selectedStrategies.forEach(strategy => {
      const allocation = PRESET_STRATEGIES[strategy];
      if (allocation) {
        simulationResults[strategy] = simulatePortfolio(
          settings.startYear,
          settings.endYear,
          settings.startCapital,
          settings.annualWithdrawal,
          settings.inflationAdj,
          allocation,
          settings.annualIncome,
          settings.incomeYears,
          settings.simulateShock ? { yearIndex: settings.shockYear - 1, severity: settings.shockSeverity } : undefined
        );
      }
    });
    setResults(simulationResults);
  }, [settings]);

  // Memoize chart data to prevent unnecessary recalculations
  const { chartData, years } = useMemo(() => {
    const years = Array.from({ length: settings.endYear - settings.startYear + 1 }, (_, i) => settings.startYear + i);
    const data = years.map((year, index) => {
      const entry: { [key: string]: any } = { year };
      settings.selectedStrategies.forEach(strategy => {
        if (results[strategy]?.portfolioValues[index] !== undefined) {
          entry[strategy] = results[strategy].portfolioValues[index];
          entry[`${strategy}Return`] = (results[strategy].annualReturns[index] ?? 0) * 100;
        }
      });
      return entry;
    });
    return { chartData: data, years };
  }, [results, settings.startYear, settings.endYear, settings.selectedStrategies]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Retirement Portfolio Simulator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Compare investment strategies using real historical data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SimulatorControls settings={settings} setSettings={setSettings} />
          
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium">Starting Capital</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">£{settings.startCapital.toLocaleString()}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium">Annual Spending</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">£{settings.annualWithdrawal.toLocaleString()}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium">Time Period</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{settings.endYear - settings.startYear + 1} years</p></CardContent>
              </Card>
               <Card>
                <CardHeader><CardTitle className="text-sm font-medium">Inflation Adj.</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{settings.inflationAdj ? '✅' : '❌'}</p></CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="allocations">Allocations</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              <TabsContent value="performance"><PerformanceCharts chartData={chartData} selectedStrategies={settings.selectedStrategies} /></TabsContent>
              <TabsContent value="allocations"><AllocationCharts results={results} /></TabsContent>
              <TabsContent value="metrics"><MetricsTable results={results} /></TabsContent>
            </Tabs>

            <EducationSection />
          </div>
        </div>
      </div>
    </div>
  );
}