// src/components/simulator/AllocationDetail.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ASSET_COLORS } from '@/lib/constants';
import { SimulationResult } from '@/lib/simulation';

interface AllocationDetailProps {
  strategy: string;
  result: SimulationResult;
}

export function AllocationDetail({ strategy, result }: AllocationDetailProps) {
  if (!result) return null;

  const assets = Object.entries(result.allocation)
    .filter(([, value]) => Number(value) > 0)
    .map(([asset, value]) => ({
      name: asset.charAt(0).toUpperCase() + asset.slice(1),
      value: Math.round(Number(value) * 100),
    }));

  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle>{strategy}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="h-48 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={assets}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {assets.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={ASSET_COLORS[entry.name.toLowerCase()]} className="focus:outline-none" />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                formatter={(value, entry) => (
                  <span className="text-slate-600 dark:text-slate-300 ml-2">{value} ({entry.payload?.value}%)</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.name}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ASSET_COLORS[asset.name.toLowerCase()] }}/>
                    {asset.name}
                  </TableCell>
                  <TableCell className="text-right">{asset.value}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}