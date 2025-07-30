// src/components/burry-tips/types.ts
import type { LucideIcon } from 'lucide-react';

export interface Pillar {
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