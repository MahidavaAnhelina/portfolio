import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { Action, Cell, State } from './state';
import { GRID_SIZE, tickMsForScore } from './state';

const CELL = 1;
const OFFSET = -(GRID_SIZE * CELL) / 2 + CELL / 2;

function cellToWorld(c: Cell): [number, number, number] {
  return [OFFSET + c.x * CELL, 0, OFFSET + c.y * CELL];
}

function Board() {
  return (
    <>
      {/* Frame */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.06, 0]}>
        <planeGeometry args={[GRID_SIZE * CELL + 1.2, GRID_SIZE * CELL + 1.2]} />
        <meshStandardMaterial color={0x2c6b2c} roughness={0.9} />
      </mesh>
      {/* Playfield */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.04, 0]}>
        <planeGeometry args={[GRID_SIZE * CELL, GRID_SIZE * CELL]} />
        <meshStandardMaterial color={0x9fd672} roughness={0.95} />
      </mesh>
    </>
  );
}

function SnakeBody({ snake }: { snake: Cell[] }) {
  return (
    <group>
      {snake.map((cell, i) => {
        const isHead = i === 0;
        const [x, , z] = cellToWorld(cell);
        return (
          <mesh key={i} position={[x, 0.35, z]} castShadow>
            <boxGeometry args={[CELL * 0.85, CELL * 0.7, CELL * 0.85]} />
            <meshStandardMaterial
              color={isHead ? 0x1b7fc4 : 0x3dd67d}
              emissive={isHead ? 0x0e5a91 : 0x28a85e}
              emissiveIntensity={isHead ? 0.5 : 0.3}
              roughness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Food({ food }: { food: Cell }) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.getElapsedTime();
    ref.current.position.y = 0.45 + Math.sin(t * 4) * 0.08;
    ref.current.rotation.y = t * 2;
  });
  const [x, , z] = cellToWorld(food);
  return (
    <mesh ref={ref} position={[x, 0.45, z]} castShadow>
      <sphereGeometry args={[CELL * 0.38, 16, 16]} />
      <meshStandardMaterial
        color={0xff5a8a}
        emissive={0xd13668}
        emissiveIntensity={0.7}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

function GameTicker({
  state,
  dispatch,
}: {
  state: State;
  dispatch: (a: Action) => void;
}) {
  const accRef = useRef(0);
  useFrame((_, dt) => {
    if (state.status !== 'playing') {
      accRef.current = 0;
      return;
    }
    accRef.current += dt * 1000;
    const tickMs = tickMsForScore(state.score);
    while (accRef.current >= tickMs) {
      accRef.current -= tickMs;
      dispatch({ type: 'tick' });
    }
  });
  return null;
}

type Props = {
  state: State;
  dispatch: (a: Action) => void;
};

export default function SnakeScene({ state, dispatch }: Props) {
  const camDist = useMemo(() => GRID_SIZE * 0.85, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [camDist * 0.4, camDist, camDist * 0.4], fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[0xa8dcf0]} />

      <ambientLight intensity={0.7} />
      <hemisphereLight color={0xb8e0ff} groundColor={0x7ab84e} intensity={0.5} />
      <directionalLight
        color={0xfff4e0}
        intensity={1.4}
        position={[10, 18, 6]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      <Board />
      <SnakeBody snake={state.snake} />
      <Food food={state.food} />

      <GameTicker state={state} dispatch={dispatch} />
    </Canvas>
  );
}
