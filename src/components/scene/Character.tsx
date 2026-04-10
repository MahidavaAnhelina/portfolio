import { useEffect, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Bone, Euler, Group, Object3D, Quaternion, SkinnedMesh, Vector3 } from 'three';
import type { ArmBone } from '../../data/projects';
import Plumbob from './Plumbob';

type BoneMap = Record<string, Bone>;

type Props = {
  hoveredProject: number;
  isMobile: boolean;
  pointingArm: ArmBone | null;
  getActiveCardRect: () => DOMRect | null;
  manualRotationRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  mouseRef: React.MutableRefObject<{ nx: number; ny: number }>;
};

const BASE_URL = import.meta.env.BASE_URL;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Aim the bone's local +Y axis at a world-space direction, expressed in the
// parent bone's local frame (bone.quaternion is parent-relative).
function aimBoneY(bone: Bone, worldDir: Vector3) {
  const parent = bone.parent;
  if (!parent) return;
  parent.updateMatrixWorld(true);
  const parentWorldQuat = parent.getWorldQuaternion(new Quaternion());
  const dirInParent = worldDir.clone().normalize()
    .applyQuaternion(parentWorldQuat.clone().invert());
  const q = new Quaternion()
    .setFromUnitVectors(new Vector3(0, 1, 0), dirInParent);
  bone.quaternion.copy(q);
}

export default function Character({
  hoveredProject,
  isMobile,
  pointingArm,
  getActiveCardRect,
  manualRotationRef,
  isDraggingRef,
  mouseRef,
}: Props) {
  const rootRef = useRef<Group>(null);
  const bonesRef = useRef<BoneMap>({});
  const restRotRef = useRef<Record<string, Euler>>({});
  const loadedRef = useRef(false);

  const gltf = useLoader(GLTFLoader, `${BASE_URL}models/character.glb`);
  const { camera } = useThree();

  useEffect(() => {
    if (!gltf?.scene || loadedRef.current) return;
    loadedRef.current = true;

    const bones: BoneMap = {};
    gltf.scene.traverse((obj: Object3D) => {
      const mesh = obj as SkinnedMesh;
      if (mesh.isMesh || mesh.isSkinnedMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
      if ((obj as Bone).isBone) {
        bones[obj.name] = obj as Bone;
      }
    });
    bonesRef.current = bones;

    if (bones.LeftArm) aimBoneY(bones.LeftArm, new Vector3(0.26, -1, 0));
    if (bones.RightArm) aimBoneY(bones.RightArm, new Vector3(-0.26, -1, 0));
    if (bones.LeftForeArm) aimBoneY(bones.LeftForeArm, new Vector3(0.10, -1, 0.45));
    if (bones.RightForeArm) aimBoneY(bones.RightForeArm, new Vector3(-0.10, -1, 0.45));

    ['LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm'].forEach((name) => {
      const b = bones[name];
      if (b) b.userData.restQuat = b.quaternion.clone();
    });

    const eulerBones = ['Head', 'Neck', 'Spine', 'Spine1', 'Spine2', 'Hips'];
    const restRot: Record<string, Euler> = {};
    eulerBones.forEach((name) => {
      const b = bones[name];
      if (b) restRot[name] = b.rotation.clone();
    });
    restRotRef.current = restRot;
  }, [gltf]);

  useFrame((rfState) => {
    if (!loadedRef.current || !rootRef.current) return;
    const bones = bonesRef.current;
    const restRot = restRotRef.current;
    const mouse = mouseRef.current;
    const t = rfState.clock.getElapsedTime();

    const idleSway = Math.sin(t * 0.8) * 0.03;
    const targetRot = isDraggingRef.current
      ? manualRotationRef.current
      : manualRotationRef.current + mouse.nx * 0.25 + idleSway;
    rootRef.current.rotation.y = lerp(rootRef.current.rotation.y, targetRot, 0.08);

    if (bones.Head && restRot.Head) {
      const rest = restRot.Head;
      bones.Head.rotation.y = lerp(bones.Head.rotation.y, rest.y + mouse.nx * 0.35, 0.1);
      bones.Head.rotation.x = lerp(bones.Head.rotation.x, rest.x + -mouse.ny * 0.2, 0.1);
    }
    if (bones.Neck && restRot.Neck) {
      const rest = restRot.Neck;
      bones.Neck.rotation.y = lerp(bones.Neck.rotation.y, rest.y + mouse.nx * 0.15, 0.1);
    }
    if (bones.Spine2 && restRot.Spine2) {
      const rest = restRot.Spine2;
      bones.Spine2.rotation.y = lerp(bones.Spine2.rotation.y, rest.y + mouse.nx * 0.08, 0.05);
    }

    const activeArm = isMobile || hoveredProject < 0 ? null : pointingArm;

    (['LeftArm', 'RightArm'] as ArmBone[]).forEach((name) => {
      const bone = bones[name];
      if (!bone) return;
      const restQ = bone.userData.restQuat as Quaternion | undefined;
      let targetQ = restQ ?? bone.quaternion;

      if (name === activeArm) {
        const rect = getActiveCardRect();
        if (rect) {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          const ndc = new Vector3(
            (cx / window.innerWidth) * 2 - 1,
            -(cy / window.innerHeight) * 2 + 1,
            0.5,
          );
          ndc.unproject(camera);
          const rayDir = ndc.sub(camera.position).normalize();
          const tHit = -camera.position.z / rayDir.z;
          const worldTarget = camera.position.clone().add(rayDir.multiplyScalar(tHit));

          const shoulderPos = bone.getWorldPosition(new Vector3());
          const worldDir = worldTarget.sub(shoulderPos).normalize();

          const parent = bone.parent;
          if (parent) {
            const parentWorldQuat = parent.getWorldQuaternion(new Quaternion());
            const dirInParent = worldDir.applyQuaternion(parentWorldQuat.invert());
            targetQ = new Quaternion()
              .setFromUnitVectors(new Vector3(0, 1, 0), dirInParent);
          }
        }
      }

      bone.quaternion.slerp(targetQ, 0.15);
    });

    if (bones.Spine && restRot.Spine) {
      const rest = restRot.Spine;
      bones.Spine.rotation.x = rest.x + Math.sin(t * 1.8) * 0.01;
    }
  });

  return (
    <group ref={rootRef}>
      <primitive object={gltf.scene} />
      <Plumbob />
    </group>
  );
}
