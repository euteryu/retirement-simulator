// src/components/stock-analysis/StockAnalysisResults.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Interface for the data we get from our Tiingo-powered backend
interface TiingoAnalysisData {
  symbol: string;
  name: string;
  description: string;
  exchange: string;
  startDate: string;
  endDate: string;
  news: {
    id: number;
    title: string;
    url: string;
    description: string;
    publishedDate: string;
    source: string;
  }[];
}

interface StockAnalysisResultsProps {
    ticker: string;
    onBack: () => void;
}

export const StockAnalysisResults = ({ ticker, onBack }: StockAnalysisResultsProps) => {
    const [analysis, setAnalysis] = useState<TiingoAnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // --- RENDER STATES ---

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-white">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
                <p className="mt-4 text-lg">Analyzing {ticker}...</p>
            </div>
        );
    }

    // 2. Error State
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

    // 3. THE CRUCIAL FIX: Success State Guard
    // We only proceed to render the main content if `analysis` is a valid object.
    if (!analysis) {
        // This handles the edge case where loading is done, there's no error, but data is still null.
        // This is a safety net.
        return (
             <div className="flex flex-col items-center justify-center h-screen text-white text-center p-4">
                <h2 className="text-2xl font-bold text-yellow-400">No Data Available</h2>
                <p className="mt-2 text-slate-300 max-w-md">Could not retrieve analysis for {ticker}. The company may not be supported by the data provider.</p>
                <Button onClick={onBack} variant="outline" className="mt-8 bg-transparent text-white hover:bg-slate-800 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Try a New Search
                </Button>
            </div>
        );
    }

    // If we reach this point, we are GUARANTEED that `analysis` is a valid object.
    // The `TypeError` crash is now impossible.
    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white min-h-screen">
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
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {/* --- COMPANY OVERVIEW CARD --- */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <Card className="bg-slate-800/50 border border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-3xl font-extrabold text-white">{analysis.name} ({analysis.symbol})</CardTitle>
                            <p className="text-indigo-300">Exchange: {analysis.exchange} | Data available from: {new Date(analysis.startDate).toLocaleDateString()}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-300 leading-relaxed line-clamp-4">{analysis.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {/* --- LATEST NEWS CARD --- */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <Card className="bg-slate-800/50 border border-slate-700/50">
                        <CardHeader>
                            <CardTitle>Latest News</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {analysis.news && analysis.news.length > 0 ? (
                                    analysis.news.map(article => (
                                        <div key={article.id} className="pb-6 border-b border-slate-700/50 last:border-b-0 last:pb-0">
                                            <p className="text-xs text-slate-400 mb-1">
                                                {new Date(article.publishedDate).toLocaleString()} - <span className="font-semibold">{article.source}</span>
                                            </p>
                                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-white hover:text-indigo-300 transition-colors">
                                                {article.title}
                                            </a>
                                            <p className="mt-2 text-sm text-slate-300 line-clamp-2">{article.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400">No recent news found for this ticker.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};