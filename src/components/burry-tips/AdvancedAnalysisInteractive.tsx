// src/components/burry-tips/AdvancedAnalysisInteractive.tsx
'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Wind, Microscope, Scale, CheckSquare, LucideIcon } from 'lucide-react';
import BubbleScene from './BubbleScene';
import PillarContentCard from './PillarContentCard';

// Define the Pillar type here as the single source of truth for this feature.
interface Pillar {
    id: string;
    title: string;
    shortTitle: string;
    icon: LucideIcon;
    description: string;
    bulletPoints: string[];
    quote: {
        text: string;
        author: string;
    };
}

const PILLARS_DATA: Pillar[] = [
    {
        id: "1",
        title: "Macro-Informed Contrarianism",
        shortTitle: "Macro View",
        icon: Wind,
        description: "Burry's process begins not with a stock, but with a big-picture, top-down view of the market to find unloved sectors.",
        bulletPoints: [
            "Identify out-of-favor industries (e.g., down >40% YTD).",
            "Look for broad themes the market is ignoring or overly pessimistic about.",
            "This is about finding the 'haystack' where the 'needles' might be."
        ],
        quote: {
            text: "I find out-of-favor industries a particularly fertile ground for best-of-breed shares at steep discounts.",
            author: "Michael Burry"
        }
    },
    {
        id: "2",
        title: "Deep Fundamental Research",
        shortTitle: "The Research",
        icon: Microscope,
        description: "Once a hunting ground is found, the real work begins. This is a bottom-up analysis of individual businesses.",
        bulletPoints: [
            "Focus on Free Cash Flow and Enterprise Value, not just P/E.",
            "Read the 10-K filings to understand the business and its risks.",
            "Prefers companies with minimal debt and a strong balance sheet."
        ],
        quote: {
            text: "My weapon of choice as a stock picker is research; it's critical for me to understand a company's value before laying down a dime.",
            author: "Michael Burry"
        }
    },
    {
        id: "3",
        title: "Valuation & Margin of Safety",
        shortTitle: "The Value",
        icon: Scale,
        description: "A great company is not a great investment unless it is bought at a significant discount to its intrinsic value.",
        bulletPoints: [
            "Look for 'sheer, outrageous value'.",
            "The goal is to buy a dollar for 50 cents.",
            "This discount, the 'Margin of Safety', is the ultimate protection against error."
        ],
        quote: {
            text: "All my stock picking is 100% based on the concept of a margin of safety.",
            author: "Michael Burry"
        }
    },
    {
        id: "4",
        title: "Pragmatic Risk Management",
        shortTitle: "The Exit",
        icon: CheckSquare,
        description: "Burry combines his deep value approach with a trader's discipline for managing risk and taking profits.",
        bulletPoints: [
            "Prefers to buy within 10-15% of a firm 52-week low.",
            "Will cut a position fast if it breaks to a new low after he's bought.",
            "Not afraid to sell for a quick 40-50% gain; he is not a 'buy and hold forever' investor."
        ],
        quote: {
            text: "I haven't had a single misfortune blow up my entire portfolio.",
            author: "Michael Burry"
        }
    }
];

export default function AdvancedAnalysisInteractive() {
    const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);

    const selectedPillar = PILLARS_DATA.find(p => p.id === selectedPillarId);

    return (
        <div className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center bg-slate-900 overflow-hidden">
            <BubbleScene pillars={PILLARS_DATA} onSelectPillar={setSelectedPillarId} selectedPillarId={selectedPillarId} />

            <AnimatePresence>
                {selectedPillar && (
                    <PillarContentCard 
                        key={selectedPillar.id}
                        pillar={selectedPillar} 
                        onClose={() => setSelectedPillarId(null)}
                    />
                )}
            </AnimatePresence>

            <div className="absolute bottom-4 text-center text-slate-500 text-sm px-4">
                Click a bubble to explore a pillar of Michael Burry's investment philosophy.
            </div>
        </div>
    );
}