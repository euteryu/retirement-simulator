// src/components/ui/interactive-fintech-background.tsx
'use client';

import React, { useRef, useEffect } from 'react';

export const InteractiveFintechBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const branches = useRef<any[]>([]);

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
            mouse.current = { x: event.clientX, y: event.clientY };
        };

        const Branch = function(this: any, x: number, y: number) {
            this.life = 0;
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
        };

        const loop = () => {
            if (branches.current.length < 200) {
                for(let i=0; i < 5; i++) {
                    branches.current.push(new (Branch as any)(mouse.current.x, mouse.current.y));
                }
            }

            // Fade out the canvas
            context.fillStyle = 'rgba(15, 23, 42, 0.05)'; // slate-900 with low alpha
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            context.beginPath();
            context.strokeStyle = "hsl(244, 84%, 58%)"; // Indigo-500

            for (let i = 0; i < branches.current.length; i++) {
                const branch = branches.current[i];
                branch.life++;

                if (branch.life > 100) {
                    branches.current.shift();
                    continue;
                }

                context.moveTo(branch.x, branch.y);

                branch.vx += (Math.random() - 0.5) * 0.5;
                branch.vy += (Math.random() - 0.5) * 0.5;
                
                // Limit speed
                branch.vx = Math.max(-1.5, Math.min(1.5, branch.vx));
                branch.vy = Math.max(-1.5, Math.min(1.5, branch.vy));

                branch.x += branch.vx;
                branch.y += branch.vy;

                context.lineTo(branch.x, branch.y);
            }

            context.lineWidth = 0.5;
            context.stroke();
            context.closePath();
            
            animationFrameId = window.requestAnimationFrame(loop);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', onMouseMove);
        
        loop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', onMouseMove);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};