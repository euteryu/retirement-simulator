// src/components/burry-tips/BubbleScene.tsx
'use client';
// This file will require extensive logic for a full 3D scene.
// For now, we will create a simplified 2D representation to fix the type errors.

import { motion } from 'framer-motion';

// This is a placeholder for the full Pillar type
interface Pillar {
    id: string;
    shortTitle: string;
    icon: React.ComponentType<{ className?: string }>;
}

// FIX: Update the props interface to expect a function that takes a string ID.
interface BubbleSceneProps {
    pillars: Pillar[];
    onSelectPillar: (id: string) => void;
    selectedPillarId: string | null;
}

export default function BubbleScene({ pillars, onSelectPillar, selectedPillarId }: BubbleSceneProps) {
    // This is a simplified 2D placeholder for the bubble scene.
    // The key is that it correctly uses the props.
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 p-8">
            {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                    <motion.button
                        key={pillar.id}
                        onClick={() => onSelectPillar(pillar.id)}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className={`relative p-4 rounded-full border-2 transition-colors
                            ${selectedPillarId === pillar.id
                                ? 'bg-indigo-500/20 border-indigo-400'
                                : 'bg-slate-700/50 border-slate-600 hover:border-indigo-500'
                            }`}
                        style={{ width: '120px', height: '120px' }}
                    >
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Icon className="h-8 w-8 text-indigo-300" />
                            <span className="mt-2 text-xs font-semibold text-white">{pillar.shortTitle}</span>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}