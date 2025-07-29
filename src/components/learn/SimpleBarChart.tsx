// src/components/learn/SimpleBarChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
    name: string;
    value: number;
    color: string;
}

interface SimpleBarChartProps {
    data: ChartData[];
    label: string;
}

export const SimpleBarChart = ({ data, label }: SimpleBarChartProps) => (
    <div className="h-64 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 my-6">
        <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                    cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                    contentStyle={{ 
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                    }}
                />
                <Bar dataKey="value" name={label} radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);