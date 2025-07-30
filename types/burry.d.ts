// types/burry.d.ts

// This file defines the "shape" of a Pillar object.
// It tells TypeScript what properties a Pillar should have.
export interface Pillar {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>; // Expects a Lucide icon component
    description: string;
    bulletPoints: string[];
    quote: {
        text: string;
        author: string;
    };
}