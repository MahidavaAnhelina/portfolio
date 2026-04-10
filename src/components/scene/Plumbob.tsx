import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

export default function Plumbob() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;
    group.current.rotation.y = t * 1.5;
    group.current.position.y = 2.15 + Math.sin(t * 2) * 0.05;
  });

  return (
    <group ref={group} position={[0, 2.15, 0]}>
      <mesh scale={[0.85, 1.35, 0.85]}>
        <octahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial
          color={0x3dd67d}
          emissive={0x2da85a}
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      <pointLight color={0x3dd67d} intensity={0.8} distance={3} />
    </group>
  );
}
