// src/components/simulator/AllocationComparison.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ASSET_COLORS } from '@/lib/constants';
import { SimulationResult } from '@/lib/simulation';
import React, { useMemo } from 'react';

interface AllocationComparisonProps {
  results: Record<string, SimulationResult>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg text-white">
        <p className="font-bold">{label}</p>
        {payload.slice().reverse().map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }}>
            {`${p.name}: ${p.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AllocationComparison({ results }: AllocationComparisonProps) {
  const { tableData, chartData, headers } = useMemo(() => {
    const strategies = Object.keys(results);
    const assetClasses = ["stocks", "bonds", "etf", "reits", "cash"];
    
    // For the table
    const tableData = strategies.map(strategy => {
      const allocation = results[strategy]?.allocation || {};
      return {
        strategy: strategy.replace(/^[^\w\s]+/, '').trim(), // Remove emoji
        ...Object.fromEntries(assetClasses.map(asset => [asset, (allocation[asset] || 0) * 100]))
      };
    });

    // For the chart
    const chartData = strategies.map(strategy => {
        const allocation = results[strategy]?.allocation || {};
        return {
          name: strategy.replace(/^[^\w\s]+/, '').trim(),
          ...Object.fromEntries(assetClasses.map(asset => [asset, (allocation[asset] || 0) * 100]))
        };
    });
    
    const headers = ["Strategy", ...assetClasses.map(a => a.charAt(0).toUpperCase() + a.slice(1))];
    
    return { tableData, chartData, headers };
  }, [results]);

  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle>Strategy Allocation Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Stacked Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Visual Comparison</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                <Legend iconType="circle" />
                {headers.slice(1).map(asset => (
                  <Bar 
                    key={asset} 
                    dataKey={asset.toLowerCase()} 
                    stackId="a" 
                    fill={ASSET_COLORS[asset.toLowerCase()]}
                    name={asset}
                    radius={[0, 4, 4, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Comparison Table */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.strategy}>
                    <TableCell className="font-medium">{row.strategy}</TableCell>
                    {headers.slice(1).map(header => (
                      <TableCell key={header}>
                        {row[header.toLowerCase() as keyof typeof row]}%
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}