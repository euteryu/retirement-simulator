// src/types/burry.ts
import React from 'react';

export interface Pillar {
    id: number;
    title: string;
    shortTitle: string; // <-- ADD THIS LINE
    icon: React.ReactNode;
    content: React.ReactNode;
}