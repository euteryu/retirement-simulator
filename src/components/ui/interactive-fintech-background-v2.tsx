// src/components/ui/interactive-fintech-background-v2.tsx
'use client';

import React, { useRef, useEffect } from 'react';

// The Particle class needs to be defined outside the component to be accessible inside useEffect
class Particle {
    x: number; y: number; z: number;
    vx: number; vy: number;
    char: string; life: number; type: 'symbol' | 'number' | 'formula';

    constructor(x: number, y: number) {
        this.x = x; this.y = y;
        this.z = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        this.life = 0;

        if ('0123456789'.includes(this.char)) this.type = 'number';
        else if ('$%£€¥'.includes(this.char)) this.type = 'symbol';
        else this.type = 'formula';
    }
}

const CHARS = [
    '$', '£', '€', '¥', '%', 'Σ', 'β', 'α', 'Δ', 'μ', 'π', 'σ', '∫', 'ƒ', '∂', '√',
    '=', '+', '-', '(', ')', '[', ']', 't', 'n', 'i', 'r',
    ...'0123456789'
];

const PARTICLE_COUNT = 300;
const GRAVITY = 0.04;
const INACTIVITY_TIMEOUT = 5000;

const COLORS = {
    symbol: 'hsl(244, 84%, 68%)',
    number: 'hsl(210, 40%, 96%)',
    formula: 'hsl(142, 71%, 45%)',
};

export const InteractiveFintechBackgroundV2 = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // FIX: Initialize mouse ref with null or a non-window-dependent value.
    const mouse = useRef<{ x: number, y: number } | null>(null);
    
    const particles = useRef<any[]>([]);
    const activityState = useRef({
        isActive: false,
        timer: null as NodeJS.Timeout | null,
    });

    useEffect(() => {
        // All code that uses `window` or `document` must be inside useEffect.
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        let animationFrameId: number;

        // FIX: Initialize mouse ref here, inside the client-only useEffect.
        if (mouse.current === null) {
            mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Don't reset mouse position on resize, let it be where it was.
        };

        const onMouseMove = (event: MouseEvent) => {
            if (mouse.current) {
                mouse.current.x = event.clientX;
                mouse.current.y = event.clientY;
            }
            
            activityState.current.isActive = true;
            if (activityState.current.timer) {
                clearTimeout(activityState.current.timer);
            }
            activityState.current.timer = setTimeout(() => {
                activityState.current.isActive = false;
            }, INACTIVITY_TIMEOUT);
        };

        const loop = () => {
            if (activityState.current.isActive && particles.current.length < PARTICLE_COUNT && mouse.current) {
                for (let i = 0; i < 5; i++) {
                    particles.current.push(new Particle(mouse.current.x, mouse.current.y));
                }
            }
            
            context.fillStyle = 'rgba(15, 23, 42, 0.2)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.life++;
                p.vy += GRAVITY;
                p.x += p.vx;
                p.y += p.vy;
                
                if (!activityState.current.isActive) { p.vx *= 0.96; p.vy *= 0.96; } 
                else { p.vx *= 0.99; p.vy *= 0.99; }

                if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                    particles.current.splice(i, 1);
                    continue;
                }
                
                const opacity = Math.max(0, 1 - p.life / 200);
                context.globalAlpha = opacity;
                const fontSize = 12 * p.z;
                context.font = `bold ${fontSize}px var(--font-poppins), monospace`;
                context.fillStyle = COLORS[p.type as keyof typeof COLORS];
                context.fillText(p.char, p.x, p.y);
                
                if (opacity <= 0) {
                    particles.current.splice(i, 1);
                }
            }
            context.globalAlpha = 1;
            
            animationFrameId = window.requestAnimationFrame(loop);
        };

        // Initialize and start
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', onMouseMove);
        loop();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', onMouseMove);
            if (activityState.current.timer) clearTimeout(activityState.current.timer);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-slate-900" />;
};