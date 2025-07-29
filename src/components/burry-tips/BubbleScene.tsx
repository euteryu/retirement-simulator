'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Bubble from './Bubble';
import { Pillar } from '@/types/burry';

interface BubbleSceneProps {
    pillars: Pillar[];
    onSelectPillar: (id: number) => void;
}

export default function BubbleScene({ pillars, onSelectPillar }: BubbleSceneProps) {
    return (
        // Set a background color on the canvas if desired
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}> 
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.3} />
            
            <Suspense fallback={null}>
                <Physics gravity={[0, 0, 0]}>
                    {pillars.map((pillar, index) => (
                        <Bubble
                            key={pillar.id}
                            pillar={pillar}
                            index={index}
                            count={pillars.length}
                            onSelect={onSelectPillar}
                        />
                    ))}
                </Physics>
            </Suspense>
        </Canvas>
    );
}