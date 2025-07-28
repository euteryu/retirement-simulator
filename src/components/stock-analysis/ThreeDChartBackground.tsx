// src/components/stock-analysis/ThreeDChartBackground.tsx
'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const PALETTE = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

// FIX: Thicker bars
const ChartBar = ({ position, height, color }: { position: [number, number, number], height: number, color: string }) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[1.2, height, 1.2]} />
            <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={0.3}
                roughness={0.4} 
                metalness={0.2}
            />
        </mesh>
    );
};

const Scene = () => {
    const textRef = useRef<THREE.Group>(null!);
    const chartGroupRef = useRef<THREE.Group>(null!);
    const light1 = useRef<THREE.PointLight>(null!);
    const light2 = useRef<THREE.PointLight>(null!);
    
    // FIX: Generate more bars, closer together, along a sweeping curve
    const bars = useMemo(() => {
        const data = [];
        const numBars = 60; // More bars for a denser, longer path
        for (let i = 0; i < numBars; i++) {
            const z = (i - numBars / 2) * 1.3; // Tighter spacing
            const x = Math.sin(i * 0.1) * 10; // << THE CURVE
            const initialHeight = 4 + Math.sin(i * 0.2) * 2.5 + Math.random();
            data.push({ 
                position: [x, initialHeight / 2, z], 
                height: initialHeight,
                color: PALETTE[i % PALETTE.length]
            });
        }
        return data;
    }, []);

    useFrame(({ clock, camera }) => {
        const time = clock.getElapsedTime();
        let totalHeightForText = 0;
        const textInfluenceRange = 3;

        if (chartGroupRef.current) {
            chartGroupRef.current.children.forEach((bar, index) => {
                const mesh = bar as THREE.Mesh;
                const originalHeight = bars[index].height;
                // Use the original X position in the wave to keep it consistent along the curve
                const wave = Math.sin(time * 0.8 + bars[index].position[0] * 0.2 + bar.position.z * 0.3);
                const newHeight = Math.max(0.5, originalHeight + wave * 2);
                
                mesh.scale.y = newHeight / originalHeight;
                mesh.position.y = newHeight / 2;
                
                if (Math.abs(bar.position.z) < textInfluenceRange) {
                    totalHeightForText += newHeight;
                }
            });
        }
        
        if (textRef.current) {
            const avgHeight = totalHeightForText / (textInfluenceRange * 2 / 1.5);
            textRef.current.position.y = avgHeight + 3.0 + Math.sin(time * 2) * 0.3;
            textRef.current.rotation.y = Math.sin(time * 0.2) * 0.15;
        }
        
        if (light1.current) {
            light1.current.position.x = Math.sin(time * 0.6) * 20;
            light1.current.position.z = Math.cos(time * 0.4) * 20;
        }
        if (light2.current) {
            light2.current.position.x = Math.cos(time * 0.2) * 20;
            light2.current.position.z = Math.sin(time * 0.5) * 20;
        }

        // FIX: Adjusted camera animation for the new curved composition
        camera.position.x = 20 + Math.sin(time * 0.1) * 2;
        camera.position.y = 15 + Math.cos(time * 0.2) * 1;
        camera.lookAt(0, 4, 0);
    });

    return (
        <>
            <ambientLight intensity={0.1} />
            <hemisphereLight intensity={0.1} groundColor="black" />
            <directionalLight position={[10, 15, -10]} intensity={0.5} />
            <pointLight ref={light1} position-y={10} intensity={8} color="#ec4899" distance={60} />
            <pointLight ref={light2} position-y={10} intensity={8} color="#8b5cf6" distance={60} />

            <group ref={textRef}>
                <Center>
                    <Text3D
                        font="/fonts/Poppins_Bold.json"
                        size={2.5}
                        height={0.4}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.05}
                        bevelSize={0.03}
                    >
                        Stock Analysis
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} roughness={0.1} metalness={0.2} />
                    </Text3D>
                </Center>
            </group>
            
            <group ref={chartGroupRef}>
                {bars.map((bar, index) => (
                    <ChartBar key={index} position={bar.position as [number, number, number]} height={bar.height} color={bar.color} />
                ))}
            </group>
        </>
    );
};

export const ThreeDChartBackground = () => {
    return (
        <div className="absolute inset-0 z-0 bg-slate-900">
            <Canvas camera={{ position: [20, 15, 25], fov: 65 }}> {/* FIX: Adjusted camera position for the curve */}
                {/* FIX: Fog pushed much further back to show more of the chart */}
                <fog attach="fog" args={['#0f172a', 30, 90]} /> 
                <Scene />
                <EffectComposer>
                    <Bloom 
                        luminanceThreshold={0.1}
                        luminanceSmoothing={0.9}
                        intensity={1.5}
                        mipmapBlur
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
};