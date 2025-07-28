// src/components/ui/interactive-fintech-background-v2.tsx
'use client';

import React, { useRef, useEffect } from 'react';

const CHARS = [
    '$', '£', '€', '¥', '%', 'Σ', 'β', 'α', 'Δ', 'μ', 'π', 'σ', '∫', 'ƒ', '∂', '√',
    '=', '+', '-', '(', ')', '[', ']', 't', 'n', 'i', 'r',
    ...'0123456789'
];

const PARTICLE_COUNT = 400;

const COLORS = {
    symbol: { h: 244, s: 84, l: 68 },
    number: { h: 210, s: 40, l: 96 },
    formula: { h: 142, s: 71, l: 45 },
};

export const InteractiveFintechBackgroundV2 = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const particles = useRef<any[]>([]);
    const activityState = useRef({
        isActive: false,
        timer: null as NodeJS.Timeout | null,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.current = { x: canvas.width / 2, y: canvas.height / 2 };
        };

        const onMouseMove = (event: MouseEvent) => {
            mouse.current.x = event.clientX;
            mouse.current.y = event.clientY;
            
            activityState.current.isActive = true;
            if (activityState.current.timer) {
                clearTimeout(activityState.current.timer);
            }
            activityState.current.timer = setTimeout(() => {
                activityState.current.isActive = false;
            }, 100);
        };

        class Particle {
            x: number; y: number; z: number;
            vx: number; vy: number; vz: number;
            char: string; life: number; maxLife: number;
            type: 'symbol' | 'number' | 'formula';
            baseColor: { h: number, s: number, l: number };
            isHero: boolean;

            constructor(x: number, y: number) {
                this.x = x; this.y = y; this.z = 0;
                this.life = 0;
                this.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                
                if ('0123456789'.includes(this.char)) this.type = 'number';
                else if ('$%£€¥'.includes(this.char)) this.type = 'symbol';
                else this.type = 'formula';
                this.baseColor = COLORS[this.type];

                this.isHero = Math.random() > 0.98;

                if (this.isHero) {
                    this.maxLife = 180;
                    this.char = '0123456789$%£€¥'[Math.floor(Math.random() * 15)];
                    this.type = 'number';
                    this.baseColor = COLORS.number;
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.vz = Math.random() * 1.5 + 1.5;
                } else {
                    this.maxLife = 100;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(Math.random() * 2 - 1);
                    const speed = Math.random() * 4 + 2;
                    this.vx = speed * Math.sin(phi) * Math.cos(theta);
                    this.vy = speed * Math.sin(phi) * Math.sin(theta);
                    this.vz = speed * Math.cos(phi);
                }
            }
        }

        const loop = () => {
            if (activityState.current.isActive && particles.current.length < PARTICLE_COUNT) {
                for (let i = 0; i < 7; i++) {
                    particles.current.push(new Particle(mouse.current.x, mouse.current.y));
                }
            }
            
            context.fillStyle = 'rgba(15, 23, 42, 0.25)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            particles.current.sort((a, b) => a.z - b.z);

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.life++;
                p.x += p.vx; p.y += p.vy; p.z += p.vz;
                p.vx *= 0.98; p.vy *= 0.98; p.vz *= 0.98;
                
                let opacity, fontSize;

                // --- THIS IS THE CRITICAL FIX ---
                // We now correctly check for the `isHero` flag and apply the special logic.
                if (p.isHero) {
                    const lifeRatio = p.life / p.maxLife;
                    const growthFactor = Math.pow(lifeRatio, 3);
                    fontSize = 20 + growthFactor * (canvas.height * 1.2);
                    
                    // This creates a fade-in, hold, and sharp fade-out effect
                    const fadeOutStart = 0.7;
                    const fadeOutDuration = 1.0 - fadeOutStart;
                    const fadeOutFactor = Math.pow(Math.max(0, (lifeRatio - fadeOutStart) / fadeOutDuration), 3);
                    opacity = Math.sin(lifeRatio * Math.PI) * (1 - fadeOutFactor);
                } else {
                    // This is the logic for all normal particles
                    const perspective = 300 / (300 + p.z);
                    fontSize = Math.max(1, 20 * perspective);
                    opacity = Math.max(0, 1 - p.life / p.maxLife);
                }

                if (opacity <= 0.01 || p.life >= p.maxLife) {
                    particles.current.splice(i, 1);
                    continue;
                }

                const perspective = 300 / (300 + p.z);
                const screenX = canvas.width / 2 + (p.x - canvas.width / 2) * perspective;
                const screenY = canvas.height / 2 + (p.y - canvas.height / 2) * perspective;
                
                context.globalAlpha = opacity;
                context.font = `bold ${fontSize.toFixed(0)}px var(--font-poppins), monospace`;
                const lightness = p.baseColor.l + p.z / 4;
                context.fillStyle = `hsl(${p.baseColor.h}, ${p.baseColor.s}%, ${lightness}%)`;
                
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(p.char, screenX, screenY);
            }
            context.globalAlpha = 1;
            
            animationFrameId = window.requestAnimationFrame(loop);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', onMouseMove);
        loop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', onMouseMove);
            if (activityState.current.timer) clearTimeout(activityState.current.timer);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-slate-900" />;
};