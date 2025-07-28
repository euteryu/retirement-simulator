// src/components/stock-analysis/StockAnalysisResults.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetricDetailModal } from './MetricDetailModal';

// Define the shape of the data we expect from our API
interface StockAnalysisData {
  symbol: string; name: string; description: string; sector: string; industry: string;
  marketCap: string; peRatio: number; eps: number; beta: number; dividendYield: number;
  yearHigh: number; yearLow: number; analystTargetPrice: number;
  recentEarnings: { fiscalDateEnding: string; reportedEPS: number; estimatedEPS: number }[];
}

// A reusable card for displaying individual statistics
const StatCard = ({ title, value, subtext, subtextColor = 'text-slate-400', metricId, onClick }: { title: string; value: string | number; subtext?: string, subtextColor?: string, metricId: string, onClick: (metricId: string) => void }) => (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
      <Card className="bg-slate-800/50 border border-slate-700/50 h-full">
          <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:bg-slate-700/50" onClick={() => onClick(metricId)}>
                <Info className="h-4 w-4" />
              </Button>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-white">{value}</div>
              {subtext && <p className={`text-xs ${subtextColor} mt-1`}>{subtext}</p>}
          </CardContent>
      </Card>
    </motion.div>
);

interface StockAnalysisResultsProps {
    ticker: string;
    onBack: () => void;
}

export const StockAnalysisResults = ({ ticker, onBack }: StockAnalysisResultsProps) => {
    const [analysis, setAnalysis] = useState<StockAnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            setError(null);
            setAnalysis(null);
            try {
                const response = await fetch(`/api/analyze-stock?ticker=${ticker}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch stock data.');
                }
                setAnalysis(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (ticker) fetchAnalysis();
    }, [ticker]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-white">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
                <p className="mt-4 text-lg">Analyzing {ticker}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-white text-center p-4">
                <h2 className="text-2xl font-bold text-red-400">Analysis Failed</h2>
                <p className="mt-2 text-slate-300 max-w-md">{error}</p>
                <Button onClick={onBack} variant="outline" className="mt-8 bg-transparent text-white hover:bg-slate-800 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Try a New Search
                </Button>
            </div>
        );
    }

    if (!analysis) {
        return null;
    }

    const getPeContext = (pe: number) => {
        if (pe > 40) return { text: "High (Growth Expected)", color: "text-green-400" };
        if (pe > 0 && pe < 15) return { text: "Low (Potential Value)", color: "text-yellow-400" };
        if (pe <= 0) return { text: "Not Profitable", color: "text-red-400" };
        return { text: "Moderate" };
    };

    const getBetaContext = (beta: number) => {
        if (beta > 1.2) return "More volatile than market";
        if (beta < 0.8) return "Less volatile than market";
        return "Similar volatility to market";
    };

    return (
      <>
        <MetricDetailModal metricId={selectedMetric} onClose={() => setSelectedMetric(null)} />
        <div className="p-4 sm:p-6 lg:p-8 text-white">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button onClick={onBack} variant="ghost" className="mb-8 text-white hover:bg-slate-800 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
              </Button>
            </motion.div>
            
            <motion.div 
                className="max-w-5xl mx-auto space-y-8"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <Card className="bg-slate-800/50 border border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-3xl font-extrabold text-white">{analysis.name} ({analysis.symbol})</CardTitle>
                            <p className="text-indigo-300">{analysis.sector} | {analysis.industry}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-300 leading-relaxed line-clamp-4">{analysis.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <StatCard title="Market Cap" value={`$${analysis.marketCap}`} metricId="marketCap" onClick={setSelectedMetric} />
                    <StatCard title="P/E Ratio" value={analysis.peRatio > 0 ? analysis.peRatio.toFixed(2) : "N/A"} metricId="peRatio" onClick={setSelectedMetric} subtext={getPeContext(analysis.peRatio).text} subtextColor={getPeContext(analysis.peRatio).color} />
                    <StatCard title="EPS (TTM)" value={`$${analysis.eps.toFixed(2)}`} metricId="eps" onClick={setSelectedMetric} />
                    <StatCard title="Dividend Yield" value={`${analysis.dividendYield.toFixed(2)}%`} metricId="dividendYield" onClick={setSelectedMetric} />
                    <StatCard title="52-Week High" value={`$${analysis.yearHigh.toFixed(2)}`} metricId="yearHigh" onClick={setSelectedMetric} />
                    <StatCard title="52-Week Low" value={`$${analysis.yearLow.toFixed(2)}`} metricId="yearLow" onClick={setSelectedMetric} />
                    <StatCard title="Beta" value={analysis.beta.toFixed(2)} subtext={getBetaContext(analysis.beta)} metricId="beta" onClick={setSelectedMetric} />
                    <StatCard title="Analyst Target" value={`$${analysis.analystTargetPrice.toFixed(2)}`} metricId="analystTarget" onClick={setSelectedMetric} />
                </div>
                
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <Card className="bg-slate-800/50 border border-slate-700/50">
                        <CardHeader><CardTitle>Recent Quarterly Earnings (EPS)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                            {analysis.recentEarnings.map(q => {
                                const didBeat = q.reportedEPS > q.estimatedEPS;
                                const difference = Math.abs(q.reportedEPS - q.estimatedEPS);
                                const beatIcon = didBeat ? <TrendingUp className="h-4 w-4 text-green-400" /> : q.reportedEPS === q.estimatedEPS ? <Minus className="h-4 w-4 text-yellow-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />;

                                return (
                                <div key={q.fiscalDateEnding}>
                                    <div className="flex justify-between items-center mb-1 text-sm font-medium">
                                        <span className="text-slate-300">{q.fiscalDateEnding}</span>
                                        <div className={`flex items-center gap-1 font-bold ${didBeat ? 'text-green-400' : 'text-red-400'}`}>
                                            {beatIcon} {didBeat ? 'Beat' : 'Miss'} by ${difference.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-xs text-slate-400 w-28">Reported:</span>
                                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                                            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (q.reportedEPS / analysis.eps) * 50)}%` }}></div>
                                        </div>
                                        <span className="text-sm font-bold w-16 text-right">${q.reportedEPS}</span>
                                    </div>
                                    <div className="flex gap-2 items-center mt-1">
                                        <span className="text-xs text-slate-400 w-28">Estimated:</span>
                                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                                            <div className="bg-slate-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (q.estimatedEPS / analysis.eps) * 50)}%` }}></div>
                                        </div>
                                        <span className="text-sm font-bold w-16 text-right">${q.estimatedEPS}</span>
                                    </div>
                                </div>
                            )})}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
      </>
    );
};