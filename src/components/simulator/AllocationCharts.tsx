// src/components/simulator/AllocationCharts.tsx
'use client';

import { SimulationResult } from '@/lib/simulation';
import { AllocationDetail } from './AllocationDetail';
import { AllocationComparison } from './AllocationComparison'; // <-- Import new component

interface AllocationChartsProps {
  results: Record<string, SimulationResult>;
}

export function AllocationCharts({ results }: AllocationChartsProps) {
  const strategies = Object.keys(results);

  if (strategies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        Select one or more strategies to see their allocations.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* New Comparison Section */}
      <AllocationComparison results={results} />
      
      {/* Existing Detailed Breakdown Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Detailed Strategy View</h2>
        <div className="space-y-6">
          {strategies.map((strategy) => (
            <AllocationDetail key={strategy} strategy={strategy} result={results[strategy]} />
          ))}
        </div>
      </div>
    </div>
  );
}