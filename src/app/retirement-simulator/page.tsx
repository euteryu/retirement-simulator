// src/app/retirement-simulator/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Hooks and Context
import { useDebounce } from '@/hooks/useDebounce';
import { useLanguage } from '@/context/LanguageContext';

// Logic and Constants
import { PRESET_STRATEGIES } from '@/lib/constants';
import { simulatePortfolio, SimulationResult } from '@/lib/simulation';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Simulator-specific Components
import { SimulatorControls } from '@/components/simulator/SimulatorControls';
import { PerformanceCharts } from '@/components/simulator/PerformanceCharts';
import { AllocationCharts } from '@/components/simulator/AllocationCharts';
import { MetricsTable } from '@/components/simulator/MetricsTable';
import { EducationSection } from '@/components/simulator/EducationSection';

// Define a type for our settings state for type-safety
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

// A local component for the summary metric cards
const MetricCard = ({ title, value }: { title: string; value: string | number }) => (
    <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
        </CardContent>
    </Card>
);

export default function RetirementSimulatorPage() {
  // Use the language context for translations
  const { t } = useLanguage();

  // State for user inputs. The UI updates this state instantly for a snappy feel.
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

  // Debounced state. The heavy simulation only runs when this value updates.
  const debouncedSettings = useDebounce(settings, 500); // 500ms delay

  // State for the simulation results.
  const [results, setResults] = useState<Record<string, SimulationResult>>({});

  // This is the core effect that runs the expensive simulation.
  // It only re-runs when the `debouncedSettings` change, preventing lag.
  useEffect(() => {
    const simulationResults: Record<string, SimulationResult> = {};
    if (debouncedSettings.selectedStrategies.length === 0) {
      setResults({});
      return;
    }

    debouncedSettings.selectedStrategies.forEach(strategy => {
      const allocation = PRESET_STRATEGIES[strategy];
      if (allocation) {
        simulationResults[strategy] = simulatePortfolio(
          debouncedSettings.startYear, debouncedSettings.endYear, debouncedSettings.startCapital, debouncedSettings.annualWithdrawal,
          debouncedSettings.inflationAdj, allocation, debouncedSettings.annualIncome, debouncedSettings.incomeYears,
          debouncedSettings.simulateShock ? { yearIndex: debouncedSettings.shockYear - 1, severity: debouncedSettings.shockSeverity } : undefined
        );
      }
    });
    setResults(simulationResults);
  }, [debouncedSettings]);

  // Memoize the data transformation for the charts for optimal performance.
  const chartData = useMemo(() => {
    const years = Array.from({ length: settings.endYear - settings.startYear + 1 }, (_, i) => settings.startYear + i);
    return years.map((year, index) => {
        const entry: { [key: string]: any } = { year };
        settings.selectedStrategies.forEach(strategy => {
            if (results[strategy]?.portfolioValues[index] !== undefined) {
                entry[strategy] = results[strategy].portfolioValues[index];
                entry[`${strategy}Return`] = (results[strategy].annualReturns[index] ?? 0) * 100;
            }
        });
        return entry;
    });
  }, [results, settings.startYear, settings.endYear, settings.selectedStrategies]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            {t('pageTitle')}
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            {t('pageSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <SimulatorControls settings={settings} setSettings={setSettings} />
          </div>
          
          <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Starting Capital" value={`£${settings.startCapital.toLocaleString()}`} />
                <MetricCard title="Annual Spending" value={`£${settings.annualWithdrawal.toLocaleString()}`} />
                <MetricCard title="Time Period" value={`${settings.endYear - settings.startYear + 1} years`} />
                <MetricCard title="Inflation Adj." value={settings.inflationAdj ? '✅ Yes' : '❌ No'} />
            </div>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 h-auto rounded-lg">
                <TabsTrigger value="performance" className="text-base">Performance</TabsTrigger>
                <TabsTrigger value="allocations" className="text-base">Allocations</TabsTrigger>
                <TabsTrigger value="metrics" className="text-base">Metrics</TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <TabsContent value="performance">
                  <PerformanceCharts 
                    chartData={chartData} 
                    selectedStrategies={settings.selectedStrategies} 
                  />
                </TabsContent>
                <TabsContent value="allocations">
                  <AllocationCharts results={results} />
                </TabsContent>
                <TabsContent value="metrics">
                  <MetricsTable results={results} />
                </TabsContent>
              </div>
            </Tabs>

            <EducationSection />
          </div>
        </div>
      </div>
    </div>
  );
}