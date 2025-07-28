// src/components/stock-analysis/AnalysisChecklist.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

const ChecklistItem = ({ isGood, text, goodText, badText }: { isGood: boolean | null, text: string, goodText: string, badText: string }) => {
    const Icon = isGood === null ? HelpCircle : isGood ? CheckCircle2 : XCircle;
    const color = isGood === null ? "text-slate-400" : isGood ? "text-green-400" : "text-red-400";

    return (
        <div className="flex items-start space-x-4 py-3 border-b border-slate-700/50 last:border-b-0">
            <Icon className={`h-6 w-6 flex-shrink-0 mt-1 ${color}`} />
            <div>
                <h4 className="font-semibold text-white">{text}</h4>
                <p className={`text-sm ${isGood ? 'text-slate-300' : 'text-slate-400'}`}>
                    {isGood ? goodText : badText}
                </p>
            </div>
        </div>
    );
};

export const AnalysisChecklist = ({ analysis }: { analysis: any }) => {
    // These thresholds are simplified rules of thumb for educational purposes
    const isProfitable = analysis.eps > 0;
    const hasReasonableDebt = analysis.debtToEquity < 1.0;
    const isGrowingRevenue = analysis.revenueGrowth > 0.05; // 5% growth
    const hasGoodMargins = analysis.grossProfitMargin > 0.40; // 40% margin

    return (
        <Card className="bg-slate-800/50 border border-slate-700/50">
            <CardHeader>
                <CardTitle>Phase 1: Business Quality Checklist</CardTitle>
            </CardHeader>
            <CardContent>
                <ChecklistItem 
                    isGood={isProfitable}
                    text="Is the company profitable?"
                    goodText={`Yes, with earnings per share of $${analysis.eps.toFixed(2)}.`}
                    badText={`No, the company is currently losing money.`}
                />
                <ChecklistItem 
                    isGood={hasGoodMargins}
                    text="Does it have strong pricing power?"
                    goodText={`Yes, with a Gross Profit Margin of ${(analysis.grossProfitMargin * 100).toFixed(1)}%. This suggests a strong brand or product.`}
                    badText={`Margins are ${(analysis.grossProfitMargin * 100).toFixed(1)}%. This could indicate high competition or low pricing power.`}
                />
                <ChecklistItem 
                    isGood={isGrowingRevenue}
                    text="Is the company growing?"
                    goodText={`Yes, revenue grew by ${(analysis.revenueGrowth * 100).toFixed(1)}% last year.`}
                    badText={`Revenue growth is low or negative, which could be a warning sign.`}
                />
                <ChecklistItem 
                    isGood={hasReasonableDebt}
                    text="Is its debt manageable?"
                    goodText={`Yes, its Debt-to-Equity ratio of ${analysis.debtToEquity.toFixed(2)} is healthy.`}
                    badText={`Its Debt-to-Equity ratio is ${analysis.debtToEquity.toFixed(2)}, which may be high for its industry.`}
                />
            </CardContent>
        </Card>
    );
};