import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Fog } from 'three';
import Ground from './Ground';
import Character from './Character';
import type { ArmBone } from '../../data/projects';

type Props = {
  isMobile: boolean;
  hoveredProject: number;
  pointingArm: ArmBone | null;
  getActiveCardRect: () => DOMRect | null;
  manualRotationRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  mouseRef: React.MutableRefObject<{ nx: number; ny: number }>;
};

function CameraRig({ isMobile }: { isMobile: boolean }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 1.55, 2.4);
      camera.lookAt(0, 1.35, 0);
    } else {
      camera.position.set(0, 1.5, 4.5);
      camera.lookAt(0, 1.2, 0);
    }
    if ('aspect' in camera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, size.width, size.height]);
  return null;
}

function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new Fog(0xa8dcf0, 15, 40);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
}

export default function Scene(props: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.1 }}
      camera={{ fov: 40, near: 0.1, far: 100, position: [0, 1.5, 4.5] }}
      style={{ position: 'fixed', inset: 0, zIndex: 1 }}
    >
      <SceneFog />
      <CameraRig isMobile={props.isMobile} />

      <ambientLight intensity={0.6} />
      <hemisphereLight
        color={0xb8e0ff}
        groundColor={0x7ab84e}
        intensity={0.5}
        position={[0, 10, 0]}
      />
      <directionalLight
        color={0xfff4e0}
        intensity={1.6}
        position={[4, 8, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />
      <directionalLight color={0xb8e0ff} intensity={0.5} position={[-5, 3, 2]} />
      <directionalLight color={0xffd6a5} intensity={0.4} position={[0, 4, -5]} />

      <Ground />

      <Suspense fallback={null}>
        <Character
          hoveredProject={props.hoveredProject}
          isMobile={props.isMobile}
          pointingArm={props.pointingArm}
          getActiveCardRect={props.getActiveCardRect}
          manualRotationRef={props.manualRotationRef}
          isDraggingRef={props.isDraggingRef}
          mouseRef={props.mouseRef}
        />
      </Suspense>
    </Canvas>
  );
}
