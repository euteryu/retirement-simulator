// src/app/stock-analysis/page.tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThreeDChartBackground } from '@/components/stock-analysis/ThreeDChartBackground'; 
import { StockAnalysisResults } from '@/components/stock-analysis/StockAnalysisResults';
import { AutocompleteSearch } from '@/components/stock-analysis/AutocompleteSearch';

export default function StockAnalysisPage() {
    const [submittedTicker, setSubmittedTicker] = useState<string | null>(null);

    return (
        <div className="relative min-h-screen bg-slate-900 overflow-x-hidden">
            <AnimatePresence mode="wait">
                {!submittedTicker ? (
                    <motion.div
                        key="initial-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.5 } }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        className="w-full h-screen"
                    >
                        <ThreeDChartBackground />
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                            >
                                <AutocompleteSearch onSelect={(ticker) => setSubmittedTicker(ticker)} />
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
                    >
                        <StockAnalysisResults 
                            ticker={submittedTicker} 
                            onBack={() => setSubmittedTicker(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}