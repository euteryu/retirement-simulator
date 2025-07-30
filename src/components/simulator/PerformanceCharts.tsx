// src/components/simulator/PerformanceCharts.tsx
'use client';

import { 
  LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, 
  CartesianGrid, Legend, Tooltip as ChartTooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COLORS } from '@/lib/constants';

interface PerformanceChartsProps {
  chartData: Record<string, string | number>[]; // An array of objects
  selectedStrategies: string[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        name: string;
        value: number;
        color: string;
        dataKey: string;
    }[];
    label?: string;
}

// A custom tooltip for a more polished UI
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => { 
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
        <p className="font-bold text-slate-800 dark:text-slate-200">{`Year: ${label}`}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center" style={{ color: p.color }}>
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }} />
            <span className="font-semibold">{p.name}:</span>
            <span className="ml-auto pl-4 font-mono">
              {p.dataKey.includes('Return')
                ? `${p.value.toFixed(1)}%`
                : `£${Math.round(p.value).toLocaleString()}`
              }
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function PerformanceCharts({ chartData, selectedStrategies }: PerformanceChartsProps) {
  return (
    <div className="space-y-8">
      {/* Portfolio Value Line Chart */}
      <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickFormatter={(value) => `£${Number(value) / 1000}k`} 
                  domain={['dataMin', 'dataMax']}
                />
                <ChartTooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {selectedStrategies.map((strategy, index) => (
                  <Line
                    key={strategy}
                    type="monotone"
                    dataKey={strategy}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Annual Returns Bar Chart */}
      <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Annual Returns Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {selectedStrategies.map((strategy, index) => (
                  <Bar
                    key={strategy}
                    dataKey={`${strategy}Return`}
                    fill={COLORS[index % COLORS.length]}
                    name={strategy}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}