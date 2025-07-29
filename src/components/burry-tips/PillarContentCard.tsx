'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Pillar } from '@/types/burry';

// Re-using the InsightCard styling for consistency
const InsightCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl not-prose h-full">
        {/* We can make the title even bigger to maintain hierarchy */}
        <h3 className="font-semibold text-3xl text-white mb-6 flex items-center gap-3">{icon} {title}</h3>

        {/* --- THE FIX IS HERE --- */}
        {/* This outer div sets the base font size and line height. */}
        <div className="text-[22px] leading-relaxed">
            {/* The inner div applies prose styling, which now inherits the 22px base size. */}
            <div className="prose dark:prose-invert max-w-none 
                            prose-p:text-inherit 
                            prose-li:text-inherit
                            prose-strong:text-white"
            >
                {children}
            </div>
        </div>
    </div>
);

interface PillarContentCardProps {
    pillar: Pillar;
    onBack: () => void;
}

export default function PillarContentCard({ pillar, onBack }: PillarContentCardProps) {
    return (
        <motion.div
            className="absolute inset-0 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="flex flex-col h-full">
                 <Button onClick={onBack} variant="ghost" className="self-start mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Selection
                </Button>
                <div className="flex-grow">
                    <InsightCard title={pillar.title} icon={pillar.icon}>
                        {pillar.content}
                    </InsightCard>
                </div>
            </div>
        </motion.div>
    );
}