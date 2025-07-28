// src/app/stock-analysis/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic'; // <-- 1. Import `dynamic` from Next.js

// --- Component Imports ---
// We will now import the 3D background dynamically
// import { ThreeDChartBackground } from '@/components/stock-analysis/ThreeDChartBackground'; // <-- 2. Comment out or delete the old static import
import { StockAnalysisResults } from '@/components/stock-analysis/StockAnalysisResults';
import { AutocompleteSearch } from '@/components/stock-analysis/AutocompleteSearch';

// --- THE CORE FIX ---
// 3. Create a dynamically imported version of the component with SSR disabled.
const ThreeDChartBackground = dynamic(
    () => import('@/components/stock-analysis/ThreeDChartBackground').then(mod => mod.ThreeDChartBackground),
    { 
        ssr: false, // This is the magic flag that disables server-side rendering for this component
        loading: () => ( // Provide a fallback component while the 3D library loads
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
            </div>
        )
    }
);

function StockAnalysisContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const tickerFromUrl = searchParams.get('ticker');
    
    const [submittedTicker, setSubmittedTicker] = useState<string | null>(tickerFromUrl);

    const handleTickerSelect = (ticker: string) => {
        if (ticker) {
            router.push(`/stock-analysis?ticker=${ticker}`);
            setSubmittedTicker(ticker);
        }
    };

    const handleGoBack = () => {
        router.push('/stock-analysis');
        setSubmittedTicker(null);
    };

    return (
        <AnimatePresence mode="wait">
            {!submittedTicker ? (
                // --- THE INITIAL VIEW ---
                <motion.div 
                    key="initial-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    className="w-full h-screen"
                >
                    {/* 4. Use the new dynamic component. It will now only render on the client. */}
                    <ThreeDChartBackground />
                    
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                        >
                            <AutocompleteSearch onSelect={handleTickerSelect} />
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                // --- THE ANALYSIS VIEW ---
                <motion.div 
                    key="results-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
                >
                    <StockAnalysisResults 
                        ticker={submittedTicker} 
                        onBack={handleGoBack}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Wrap the component in Suspense for the useSearchParams hook to work correctly
export default function StockAnalysisPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
                <Loader2 className="h-16 w-16 animate-spin text-indigo-400"/>
            </div>
        }>
            <div className="relative min-h-screen bg-slate-900 overflow-x-hidden">
                <StockAnalysisContent />
            </div>
        </Suspense>
    );
}