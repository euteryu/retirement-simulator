// types/global.d.ts

// This file is for global type declarations and module augmentations.

// Declaration for react-katex to solve that issue permanently
declare module 'react-katex';

// --- Your Custom Pillar Type ---
// We will define it in a global namespace to ensure it's available everywhere.

// We use `import type` to get the icon type without creating a real dependency
import type { LucideIcon } from 'lucide-react';

declare global {
  interface Pillar {
    id: string;
    title: string;
    icon: LucideIcon;
    description: string;
    bulletPoints: string[];
    quote: {
      text: string;
      author: string;
    };
  }
}

// This empty export is a trick to make TypeScript treat this file as a module.
export {};