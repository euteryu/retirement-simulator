// src/components/simulator/MetricsTable.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SimulationResult } from "@/lib/simulation";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsTableProps {
  results: Record<string, SimulationResult>;
}

export function MetricsTable({ results }: MetricsTableProps) {
  const strategies = Object.keys(results);

  if (strategies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        Select a strategy to see its metrics.
      </div>
    );
  }

  const headers = ["Strategy", "Final Value", "Total Withdrawn", "Max Drawdown", "Volatility (Std. Dev)", "Years Lasted", "Success"];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map(header => <TableHead key={header} className="font-bold">{header}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies.map((strategy) => {
                const summary = results[strategy]?.summary;
                if (!summary) return null;
                const isSuccess = summary['Success'] === "100%";
                return (
                  <TableRow key={strategy} className={isSuccess ? "bg-green-500/5 dark:bg-green-500/10" : "bg-red-500/5 dark:bg-red-500/10"}>
                    <TableCell className="font-medium">{strategy}</TableCell>
                    <TableCell className="font-semibold">£{(summary['Final Value'] as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell>£{(summary['Total Withdrawn'] as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell>{summary['Max Drawdown']}</TableCell>
                    <TableCell>{summary['Volatility (Std. Dev)']}</TableCell>
                    <TableCell>{summary['Years Lasted']}</TableCell>
                    <TableCell className="font-bold">{isSuccess ? "✅" : "❌"} {summary['Success']}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}