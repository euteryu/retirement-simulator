'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import { RigidBody, type RigidBody as RigidBodyType } from '@react-three/rapier';
import * as THREE from 'three';
// import { Pillar } from '@/types/burry';

interface BubbleProps {
    pillar: Pillar;
    index: number;
    count: number;
    onSelect: (id: number) => void;
}

// export default function Bubble({ pillar, index, count, onSelect }: BubbleProps) {
//     const body = useRef<RigidBodyType>(null!);
//     const [hovered, setHovered] = useState(false);
    
//     const phaseOffset = useMemo(() => (index / count) * Math.PI * 2, [index, count]);
//     const vec = new THREE.Vector3();

//     useFrame(({ clock }) => {
//         if (!body.current) return;
        
//         const t = clock.getElapsedTime() * 0.4 + phaseOffset; // Slower movement
        
//         // --- CHANGE 1: INCREASED ORBIT SIZE ---
//         const scale = 6.5; // Was 4
//         const x = (scale * Math.cos(t)) / (1 + Math.sin(t) ** 2);
//         const y = (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2);
//         const z = Math.sin(t * 2) * 2; // Increased z-axis movement for more depth
        
//         body.current.setNextKinematicTranslation(vec.set(x, y, z));
//     });

//     const handlePointerOver = (e: any) => {
//         e.stopPropagation();
//         setHovered(true);
//         document.body.style.cursor = 'pointer';
//     };

//     const handlePointerOut = () => {
//         setHovered(false);
//         document.body.style.cursor = 'auto';
//     };
    
//     const handleClick = () => {
//         onSelect(pillar.id);
//     };

//     return (
//         <RigidBody ref={body} type="kinematicPosition" colliders="ball">
//             <mesh 
//                 onPointerOver={handlePointerOver} 
//                 onPointerOut={handlePointerOut}
//                 onClick={handleClick}
//             >
//                 {/* --- CHANGE 2: LARGER SPHERE --- */}
//                 <sphereGeometry args={[1.5, 32, 32]} /> {/* Radius was 1, now 1.5 */}

//                 {/* --- CHANGE 3: HIGHER CONTRAST BUBBLE MATERIAL --- */}
//                 <meshStandardMaterial 
//                     color={hovered ? '#6d28d9' : '#4c1d95'} // Darker, richer purple
//                     emissive={hovered ? '#8b5cf6' : '#5b21b6'}
//                     emissiveIntensity={hovered ? 0.6 : 0.3}
//                     transparent 
//                     opacity={0.85} 
//                     roughness={0.1}
//                     metalness={0.1}
//                 />
                 
//                 <Center>
//                     {/* --- CHANGE 4: LARGER, BRIGHTER, MORE LEGIBLE TEXT --- */}
//                     <Text3D
//                         font="/fonts/Poppins_Bold.json"
//                         size={0.35} // Was 0.2
//                         height={0.05}
//                         curveSegments={12}
//                         bevelEnabled
//                         bevelThickness={0.01}
//                         bevelSize={0.01}
//                         bevelOffset={0}
//                         bevelSegments={5}
//                     >
//                         {pillar.shortTitle} {/* Using the new short title */}
//                         <meshStandardMaterial 
//                             emissive="#ffffff" // Pure white emissive glow
//                             emissiveIntensity={hovered ? 1.5 : 1} // Glows brightly
//                             color="#ffffff" // Base color is pure white
//                         />
//                     </Text3D>
//                 </Center>
//             </mesh>
//         </RigidBody>
//     );
// }