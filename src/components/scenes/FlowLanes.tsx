import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Four parallel freight lanes that glide past — suggests a conveyor of shipments.
const LANES = [
  { y: 1.4, color: "#E6017A", offset: 0.0, speed: 0.9 },
  { y: 0.45, color: "#5E72FA", offset: 0.4, speed: 1.15 },
  { y: -0.5, color: "#1E3FE0", offset: 0.8, speed: 0.75 },
  { y: -1.45, color: "#E6017A", offset: 1.2, speed: 1.0 },
];

const SPACING = 3.2;
const LANE_LEN = 32;
const CRATES_PER_LANE = Math.floor(LANE_LEN / SPACING);

function Lane({
  y,
  color,
  offset,
  speed,
}: {
  y: number;
  color: string;
  offset: number;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (!group.current) return;
    group.current.position.x -= d * speed * 0.9;
    if (group.current.position.x < -SPACING) {
      group.current.position.x += SPACING;
    }
  });
  const items = useMemo(() => Array.from({ length: CRATES_PER_LANE + 2 }, (_, i) => i), []);
  return (
    <group position={[offset, y, 0]}>
      <group ref={group}>
        {items.map((i) => (
          <group key={i} position={[i * SPACING - LANE_LEN / 2, 0, 0]}>
            <mesh>
              <boxGeometry args={[2.0, 0.9, 1.0]} />
              <meshStandardMaterial
                color={color}
                metalness={0.4}
                roughness={0.5}
                emissive={color}
                emissiveIntensity={0.1}
                transparent
                opacity={0.82}
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(2.0, 0.9, 1.0)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.25} />
            </lineSegments>
          </group>
        ))}
      </group>
      {/* Rail glow line */}
      <mesh position={[0, -0.55, 0]}>
        <planeGeometry args={[LANE_LEN, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function FlowLanes() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={0.8} />
      <directionalLight position={[-5, 2, -3]} intensity={0.35} color="#1E3FE0" />
      <group rotation={[0.25, 0.5, 0]} position={[0, 0, 0]} scale={0.7}>
        {LANES.map((l, i) => (
          <Lane key={i} {...l} />
        ))}
      </group>
    </>
  );
}
