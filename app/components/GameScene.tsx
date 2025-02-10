"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

const GridSize = 5;

function Sphere({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
}

function SphereGrid() {
  const spacing = 1.5;
  const spheres = [];

  for (let x = 0; x < GridSize; x++) {
    for (let y = 0; y < GridSize; y++) {
      for (let z = 0; z < GridSize; z++) {
        if ((x + y + z) % 2 === 0) {
          spheres.push(
            <Sphere
              key={`${x}-${y}-${z}`}
              position={[x * spacing, y * spacing, z * spacing]}
            />
          );
        }
      }
    }
  }

  return <>{spheres}</>;
}

interface GameSceneProps {
  progress: number;
}

export function GameScene({ progress }: GameSceneProps) {
  const { position } = useSpring({
    position: [0, 0, progress * 1.5],
    config: { mass: 1, tension: 120, friction: 14 },
  });

  return (
    <Canvas>
      <animated.perspectiveCamera position={position.to((p) => p)} fov={75} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <SphereGrid />
      <OrbitControls />
    </Canvas>
  );
}
