"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { useRef, useMemo } from "react";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";
import { CanvasTexture } from "three";
import * as THREE from "three";

const SPHERE_RADIUS = 0.4;
const SPACING = 2;
const LEVEL_HEIGHT = 5;

function createCreepyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Create radial gradient for a glowing effect
  const gradient = ctx.createRadialGradient(
    256, 256, 50,  // Inner circle
    256, 256, 256  // Outer circle
  );
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.4, 'transparent');

  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw glowing question mark
  ctx.fillStyle = gradient;
  ctx.font = "bold 400px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", canvas.width / 2, canvas.height / 2);

  return new CanvasTexture(canvas);
}

function Sphere({ position }: { position: [number, number, number] }) {
  const texture = useMemo(() => createCreepyTexture(), []);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Slower, more ominous rotation
      meshRef.current.rotation.y += 0.005;
      // Subtle floating effect
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.0001;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[SPHERE_RADIUS, 64, 64]} />
      <meshPhysicalMaterial
        color="#000000"
        metalness={0}
        roughness={0.2}
        transmission={0.95} // Glass-like transparency
        thickness={0.5}    // Glass thickness
        map={texture}
        emissiveMap={texture}
        emissive="#ff0000"
        emissiveIntensity={2}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function SphereArrangement({ totalLevels }: { totalLevels: number }) {
  const spheres: React.ReactNode[] = [];
  const basePositions = createLevelPositions();

  for (let level = 0; level < totalLevels; level++) {
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

function MovingCamera({
  progress,
  totalLevels,
}: {
  progress: number;
  totalLevels: number;
}) {
  const cameraRef = useRef<PerspectiveCameraType>(null);

  useFrame(() => {
    if (cameraRef.current) {
      const targetZ = LEVEL_HEIGHT * (totalLevels - progress);
      const currentZ = cameraRef.current.position.z;

      if (Math.abs(currentZ - targetZ) > 0.01) {
        cameraRef.current.position.z += (targetZ - currentZ) * 0.1;
      }
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      position={[0, 0, totalLevels * LEVEL_HEIGHT]}
      fov={20}
      makeDefault
    />
  );
}

interface GameSceneProps {
  progress: number;
  totalLevels: number;
}

export function GameScene({ progress, totalLevels }: GameSceneProps) {
  return (
    <div className="relative w-full h-full">
      <Canvas shadows>
        <color attach="background" args={["#000"]} />
        <fog attach="fog" args={["#000", 2, 20]} />
        <MovingCamera progress={progress} totalLevels={totalLevels} />
        <Environment preset="warehouse" />
        <ambientLight intensity={0.05} />
        <pointLight position={[0, 5, 5]} intensity={0.2} color="#ff0000" />
        <SphereArrangement totalLevels={totalLevels} />
      </Canvas>
    </div>
  );
}

function createLevelPositions() {
  const positions: [number, number, number][] = [];
  const GRID_SIZE = 10;
  const HALF_GRID = GRID_SIZE / 2;

  // Create a 10x10 grid centered around 0,0
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = (i - HALF_GRID + 0.5) * SPACING;
      const y = (j - HALF_GRID + 0.5) * SPACING;
      positions.push([x, y, 0]);
    }
  }

  return positions;
}
