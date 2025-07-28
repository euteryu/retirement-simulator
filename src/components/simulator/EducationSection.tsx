// src/components/simulator/EducationSection.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';

export function EducationSection() {
  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle>Key Investment Concepts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-yellow-500" />Why Invest?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Cash in savings accounts loses buying power to inflation over time. Investing allows your money to grow by owning parts of successful businesses.</p>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="text-green-500" />The Power of Diversification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Don't put all eggs in one basket. Mixing assets like stocks and bonds smooths out returns and reduces risk during market downturns.</p>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="text-red-500" />Sequence of Returns Risk</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">A market crash early in retirement is far more dangerous than one later on, because you're selling assets at low prices to live. Test this using the "Market Shock" simulation!</p>
        </div>
        
        <div className="text-center pt-4">
            <Link href="/learn">
                <Button variant="outline">
                    Go to Learning Center for More
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}