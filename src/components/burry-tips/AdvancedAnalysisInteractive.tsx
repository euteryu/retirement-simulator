'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wind, Gem, Globe, Activity, ChevronLeft } from 'lucide-react';
import BubbleScene from './BubbleScene';
import PillarContentCard from './PillarContentCard';
import { Pillar } from '@/types/burry';

// This is the data for our four pillars.
// We define it here to pass it down to our child components.
const PILLARS_DATA: Pillar[] = [
    {
        id: 1,
        title: "Macro-Informed Contrarianism",
        shortTitle: "Macro View",
        icon: <Wind className="text-sky-400" />,
        content: (
            <>
                <p>This is his biggest evolution. He now often starts with a strong, top-down view of the entire economy and then finds specific ways to bet against consensus.</p>
                <div className="mt-4 pl-4 border-l-2 border-slate-600 space-y-2">
                    <p><strong>What He Values:</strong> Identifying bubbles and systemic risks (e.g., inflation, speculative manias).</p>
                    <p><strong>Example Execution:</strong> His large put option position against Cathie Wood's ARKK ETF was not a bet against one company, but against the entire *concept* of "disruptive innovation" at any price.</p>
                </div>
            </>
        ),
    },
    {
        id: 2,
        title: "Deep Value Cyclicals & Inflation Hedges",
        shortTitle: "Deep Value",
        icon: <Gem className="text-green-400" />,
        content: (
            <>
                <p>His long positions are often in deeply unloved, "old-economy" sectors that benefit from the very macro trends he's worried about, like inflation or supply chain chaos.</p>
                <div className="mt-4 pl-4 border-l-2 border-slate-600 space-y-2">
                    <p><strong>What He Values:</strong> Tangible assets and pricing power.</p>
                    <p><strong>Example Execution:</strong> Investing in dry bulk shippers, traditional energy companies, or private prisons. These are businesses with physical assets whose profits can soar during periods of inflation or geopolitical instability.</p>
                </div>
            </>
        ),
    },
    {
        id: 3,
        title: "Geographic Contrarianism",
        shortTitle: "Global Plays", 
        icon: <Globe className="text-blue-400" />,
        content: (
            <>
                <p>He has recognized that some of the most extreme mispricings are in international markets that are deeply out of favor.</p>
                <div className="mt-4 pl-4 border-l-2 border-slate-600 space-y-2">
                    <p><strong>What He Values:</strong> Good businesses in hated markets.</p>
                    <p><strong>Example Execution (Japan):</strong> He invested heavily in Japanese trading houses, seeing that corporate governance was improving in a market that had been stagnant for decades, leading to extremely low valuations.</p>
                    <p><strong>Example Execution (China):</strong> He invested in giants like JD.com and Alibaba *after* the government's regulatory crackdown, betting that political fear was overblown relative to the fundamental value of the businesses.</p>
                </div>
            </>
        ),
    },
    {
        id: 4,
        title: "Event-Driven 'Special Situations'",
        shortTitle: "Special Situations",
        icon: <Activity className="text-red-400" />,
        content: (
            <>
                <p>This is classic Burry: capitalizing on market chaos and specific corporate events where forced selling and irrational panic create opportunity.</p>
                <div className="mt-4 pl-4 border-l-2 border-slate-600 space-y-2">
                    <p><strong>What He Values:</strong> Forced selling and irrational panic.</p>
                    <p><strong>Example Execution (Regional Banks 2023):</strong> When Silicon Valley Bank collapsed, the entire sector was sold off indiscriminately. Burry bought shares in *other*, healthier regional banks, betting that the market was wrongly assuming they would all fail. This is the ultimate "baby thrown out with the bathwater" scenario.</p>
                </div>
            </>
        ),
    }
];

export default function AdvancedAnalysisInteractive() {
    const [selectedPillarId, setSelectedPillarId] = useState<number | null>(null);

    const selectedPillar = useMemo(
        () => PILLARS_DATA.find(p => p.id === selectedPillarId) || null,
        [selectedPillarId]
    );

    const handleSelectPillar = (id: number) => {
        setSelectedPillarId(id);
    };

    const handleGoBack = () => {
        setSelectedPillarId(null);
    };
    
    return (
        <div className="my-24 border-t-2 border-amber-500/30 pt-12 min-h-[600px] relative">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-700">
                    <Activity className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                    <h2 className="text-xl text-amber-300 font-semibold tracking-wide uppercase">Advanced Analysis</h2>
                    <p className="text-3xl font-bold tracking-tight text-white">Burry's Modern Strategy (2020-2025+)</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative h-[500px] w-full mt-4">
                <AnimatePresence mode="wait">
                    {selectedPillar ? (
                        <PillarContentCard 
                            key={selectedPillar.id}
                            pillar={selectedPillar} 
                            onBack={handleGoBack} 
                        />
                    ) : (
                        <motion.div
                            key="bubble-scene"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            className="absolute inset-0"
                        >
                            <BubbleScene pillars={PILLARS_DATA} onSelectPillar={handleSelectPillar} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}