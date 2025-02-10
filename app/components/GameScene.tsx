"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useEffect, useRef, useState } from "react";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";

const MAX_LEVELS = 2;
const SPHERE_RADIUS = 0.3;
const SPACING = 1;
const LEVEL_HEIGHT = 2; // Vertical spacing between levels

// Debug panel component
function DebugPanel({
  level,
  setLevel,
}: {
  level: number;
  setLevel: (level: number) => void;
}) {
  return (
    <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded-lg space-y-2 pointer-events-auto">
      <div>Debug Controls</div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max={MAX_LEVELS}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="w-32"
        />
        <span>
          Level: {level}/{MAX_LEVELS}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setLevel(Math.max(0, level - 1))}
          className="px-2 py-1 bg-white/10 rounded hover:bg-white/20"
        >
          Prev
        </button>
        <button
          onClick={() => setLevel(Math.min(MAX_LEVELS, level + 1))}
          className="px-2 py-1 bg-white/10 rounded hover:bg-white/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Sphere({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />
      <meshStandardMaterial
        color="#4169E1" // royalblue
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function SphereArrangement() {
  const spheres: React.ReactNode[] = [];
  const basePositions = createLevelPositions();

  // Create multiple rings of spheres
  for (let level = 0; level < MAX_LEVELS; level++) {
    basePositions.forEach((position, index) => {
      spheres.push(
        <Sphere
          key={`${level}-${index}`}
          position={[
            position[0],
            position[1],
            position[2] + level * LEVEL_HEIGHT,
          ]}
        />
      );
    });
  }

  return <>{spheres}</>;
}

interface GameSceneProps {
  progress: number;
}

function MovingCamera({ debugLevel }: { debugLevel: number }) {
  const cameraRef = useRef<PerspectiveCameraType>(null);

  useFrame(() => {
    if (cameraRef.current) {
      const targetZ = -debugLevel * LEVEL_HEIGHT + 3;
      const currentZ = cameraRef.current.position.z;
      // Smooth camera movement
      if (Math.abs(currentZ - targetZ) > 0.01) {
        cameraRef.current.position.z += (targetZ - currentZ) * 0.1; // Smooth transition
      }
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      position={[0, 0, 3]} // Start slightly above center
      fov={75}
      makeDefault
    />
  );
}

export function GameScene({ progress }: GameSceneProps) {
  const [debugLevel, setDebugLevel] = useState(0);

  return (
    <div className="relative w-full h-full">
      <Canvas>
        <MovingCamera debugLevel={debugLevel} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <SphereArrangement />
      </Canvas>
      <DebugPanel level={debugLevel} setLevel={setDebugLevel} />
    </div>
  );
}

function createLevelPositions() {
  const positions: [number, number, number][] = [];

  positions.push([-0.5, -0.5, 0]);
  positions.push([0.5, -0.5, 0]);
  positions.push([-0.5, 0.5, 0]);
  positions.push([0.5, 0.5, 0]);

  return positions;
}
