import { useMemo } from 'react';

// Deterministic grass tuft positions so they don't flicker around on every
// render. Seeded by index.
function generateTufts(count: number) {
  const out: Array<{ pos: [number, number, number]; rot: number }> = [];
  for (let i = 0; i < count; i++) {
    // Stable pseudo-random based on index.
    const a = (i * 2654435761) % 1000 / 1000;
    const b = ((i + 1) * 40503) % 1000 / 1000;
    const c = ((i + 2) * 73856093) % 1000 / 1000;
    const angle = a * Math.PI * 2;
    const r = 1.5 + b * 4;
    out.push({
      pos: [Math.cos(angle) * r, 0.07, Math.sin(angle) * r],
      rot: c * Math.PI,
    });
  }
  return out;
}

export default function Ground() {
  const tufts = useMemo(() => generateTufts(24), []);

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[6, 48]} />
        <meshStandardMaterial color={0x7ab84e} roughness={0.9} />
      </mesh>
      {tufts.map((t, i) => (
        <mesh key={i} position={t.pos} rotation-y={t.rot}>
          <coneGeometry args={[0.08, 0.15, 4]} />
          <meshStandardMaterial color={0x5ba030} roughness={1} />
        </mesh>
      ))}
    </>
  );
}
