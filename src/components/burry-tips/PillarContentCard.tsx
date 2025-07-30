// src/components/burry-tips/PillarContentCard.tsx
'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This is a placeholder for the full Pillar type
interface Pillar {
    id: string;
    title: string;
    description: string;
    bulletPoints: string[];
    quote: {
        text: string;
        author: string;
    };
}

// FIX: Update the props interface to include the `onClose` function.
interface PillarContentCardProps {
    pillar: Pillar;
    onClose: () => void;
}

export default function PillarContentCard({ pillar, onClose }: PillarContentCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="absolute z-20 w-[90vw] max-w-lg p-6 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl"
        >
            <div className="relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <h2 className="text-2xl font-bold text-white mb-2">{pillar.title}</h2>
                <p className="text-sm text-slate-400 mb-4">{pillar.description}</p>
                
                <ul className="space-y-2 list-disc list-inside text-slate-200 mb-6">
                    {pillar.bulletPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>

                <blockquote className="border-l-4 border-slate-600 pl-4">
                    <p className="italic text-slate-300">"{pillar.quote.text}"</p>
                    <footer className="text-right text-sm text-slate-400 mt-1">- {pillar.quote.author}</footer>
                </blockquote>
            </div>
        </motion.div>
    );
}
