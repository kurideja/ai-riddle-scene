"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Text } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";
import { CanvasTexture } from "three";
import * as THREE from "three";

const SPHERE_RADIUS = 0.4;
const SPACING = 1.5;
const LEVEL_HEIGHT = 5;
const MOBILE_GRID_SIZE = 4; // Reduced from 5
const DESKTOP_GRID_SIZE = 6; // Reduced from 10

function createCreepyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256; // Reduced from 512
  canvas.height = 256; // Reduced from 512
  const ctx = canvas.getContext("2d")!;

  // Create simpler gradient
  const gradient = ctx.createRadialGradient(
    128,
    128,
    25, // Adjusted for new canvas size
    128,
    128,
    128 // Adjusted for new canvas size
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.4, "transparent");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = gradient;
  ctx.font = "bold 200px Arial"; // Reduced from 400px
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", canvas.width / 2, canvas.height / 2);

  return new CanvasTexture(canvas);
}

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function Sphere({ position }: { position: [number, number, number] }) {
  const texture = useMemo(() => createCreepyTexture(), []);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Use clock.elapsedTime for consistent rotation speed
      meshRef.current.rotation.y = state.clock.elapsedTime * (isMobile() ? 0.5 : 0.3);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />{" "}
      {/* Further reduced segments */}
      <meshPhysicalMaterial
        color="#000000"
        metalness={0}
        roughness={0.3}
        transmission={0.6} // Reduced transmission
        thickness={0.5}
        map={texture}
        emissiveMap={texture}
        emissive="#ff0000"
        emissiveIntensity={1.0} // Reduced intensity
        envMapIntensity={0.3} // Reduced intensity
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

function VictoryScene() {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      // Rotate the torus
      torusRef.current.rotation.x += 0.01;
      torusRef.current.rotation.y += 0.01;

      // Pulsate scale and emission intensity
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
      torusRef.current.scale.setScalar(pulse);

      // Update material emission intensity
      const material = torusRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 2 + pulse;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff0000" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#ff4444" />

      <mesh ref={torusRef}>
        <torusGeometry args={[3, 0.5, 32, 100]} />
        <meshPhysicalMaterial
          color="#000000"
          emissive="#ff0000"
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <Text
        position={[0, 0, 0]}
        fontSize={1.5}
        color="#ff0000"
        anchorX="center"
        anchorY="middle"
      >
        VICTORY!
      </Text>
    </>
  );
}

interface GameSceneProps {
  progress: number;
  totalLevels: number;
  isComplete?: boolean;
}

function MistakeFlash({ score }: { score: number }) {
  const [lastScore, setLastScore] = useState(score);
  const [isFlashing, setIsFlashing] = useState(false);
  const flashRef = useRef<THREE.DirectionalLight>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (score < lastScore) {
      // Start flash when score decreases
      setIsFlashing(true);
      startTimeRef.current = 0;
    }
    setLastScore(score);
  }, [lastScore, score]);

  useFrame((state) => {
    if (isFlashing && flashRef.current) {
      if (startTimeRef.current === 0) {
        startTimeRef.current = state.clock.elapsedTime;
      }

      const elapsed = state.clock.elapsedTime - startTimeRef.current;
      if (elapsed > 1) {
        // Stop flashing after 1 second
        setIsFlashing(false);
        flashRef.current.intensity = 0;
      } else {
        // Smooth sine wave for the flash
        const intensity = Math.sin(elapsed * Math.PI) * 3;
        flashRef.current.intensity = Math.max(0, intensity);
      }
    }
  });

  return (
    <directionalLight
      ref={flashRef}
      position={[0, -8, 10]}
      color="#ff0000"
      intensity={0}
      castShadow
    />
  );
}

export function GameScene({
  progress,
  totalLevels,
  isComplete,
}: GameSceneProps) {
  if (isComplete) {
    return (
      <div className="relative w-full h-full">
        <Canvas>
          <color attach="background" args={["#000"]} />
          <PerspectiveCamera position={[0, 0, 10]} makeDefault />
          <VictoryScene />
        </Canvas>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Canvas shadows={false}>
        {/* Disabled shadows */}
        <color attach="background" args={["#000"]} />
        <fog attach="fog" args={["#000", 10, 30]} />
        {/* Reduced fog distance */}
        <MovingCamera progress={progress} totalLevels={totalLevels} />
        <Environment preset="warehouse" />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 5, 5]} intensity={0.2} color="#ff0000" />
        <SphereArrangement totalLevels={totalLevels} />
        <MistakeFlash score={progress} />
      </Canvas>
    </div>
  );
}

function createLevelPositions() {
  const positions: [number, number, number][] = [];
  const GRID_SIZE = isMobile() ? MOBILE_GRID_SIZE : DESKTOP_GRID_SIZE;
  const HALF_GRID = GRID_SIZE / 2;

  // Create a grid centered around 0,0
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = (i - HALF_GRID + 0.5) * SPACING;
      const y = (j - HALF_GRID + 0.5) * SPACING;
      positions.push([x, y, 0]);
    }
  }

  return positions;
}
