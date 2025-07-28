// src/app/stock-analysis/page.tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// --- New Imports ---
import { ThreeDChartBackground } from '@/components/stock-analysis/ThreeDChartBackground'; 
import { StockAnalysisResults } from '@/components/stock-analysis/StockAnalysisResults'; // We will create this

// --- We need a new component to hold the results to keep this file clean ---
// --- It would contain all the cards and logic from our previous implementation ---

export default function StockAnalysisPage() {
    const [ticker, setTicker] = useState('');
    const [submittedTicker, setSubmittedTicker] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (ticker.trim()) {
            setSubmittedTicker(ticker.trim().toUpperCase());
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-900 overflow-hidden">
            {/* AnimatePresence will handle the smooth transition between the two views */}
            <AnimatePresence>
                {!submittedTicker ? (
                    // --- THE INITIAL VIEW ---
                    <motion.div
                        key="initial-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-screen"
                    >
                        <ThreeDChartBackground />
                        
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                            >
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        value={ticker}
                                        onChange={(e) => setTicker(e.target.value)}
                                        placeholder="Search Company Stock (e.g., AAPL)"
                                        className="w-80 md:w-96 h-16 px-6 text-lg text-center text-white
                                                   bg-white/5 backdrop-blur-md border border-white/10 
                                                   rounded-full shadow-lg outline-none 
                                                   placeholder-slate-400 focus:ring-2 focus:ring-indigo-400
                                                   transition-all"
                                    />
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    // --- THE ANALYSIS VIEW (after submitting) ---
                    <motion.div
                        key="results-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {/* 
                          We pass the submitted ticker to a dedicated results component.
                          This component will handle its own fetching, loading, and error states.
                          We also pass a function to allow the results component to "go back".
                        */}
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