import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function ring(r: number, seg = 128): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    pts.push([Math.cos(t) * r, 0, Math.sin(t) * r]);
  }
  return pts;
}

function tick(from: number, to: number, angle: number): [number, number, number][] {
  const x1 = Math.cos(angle) * from;
  const z1 = Math.sin(angle) * from;
  const x2 = Math.cos(angle) * to;
  const z2 = Math.sin(angle) * to;
  return [
    [x1, 0, z1],
    [x2, 0, z2],
  ];
}

export default function CompassScene() {
  const group = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.Mesh>(null);
  const rings = useMemo(() => [1.4, 2.1, 2.8, 3.5], []);
  const ticks = useMemo(
    () => Array.from({ length: 24 }, (_, i) => (i * Math.PI) / 12),
    []
  );
  const majorTicks = useMemo(
    () => Array.from({ length: 4 }, (_, i) => (i * Math.PI) / 2),
    []
  );

  const sweepGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    const r = 3.5;
    const span = Math.PI / 6;
    const seg = 24;
    for (let i = 0; i <= seg; i++) {
      const t = (i / seg) * span;
      shape.lineTo(Math.cos(t) * r, Math.sin(t) * r);
    }
    shape.lineTo(0, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);

  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.05;
    if (sweep.current) sweep.current.rotation.z -= d * 0.9;
  });

  const nodes = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.3;
      const r = 1.4 + ((i * 37) % 10) / 10 * 2;
      out.push([Math.cos(a) * r, 0, Math.sin(a) * r]);
    }
    return out;
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={0.5} />
      <group ref={group} rotation={[-Math.PI / 2.4, 0, 0]} scale={0.95}>
        {rings.map((r, i) => (
          <Line
            key={i}
            points={ring(r)}
            color={i === rings.length - 1 ? "#E6017A" : "#1E3FE0"}
            lineWidth={1}
            transparent
            opacity={i === rings.length - 1 ? 0.5 : 0.22}
          />
        ))}
        {ticks.map((a, i) => (
          <Line
            key={`t-${i}`}
            points={tick(3.5, 3.7, a)}
            color="#5E72FA"
            lineWidth={1}
            transparent
            opacity={0.4}
          />
        ))}
        {majorTicks.map((a, i) => (
          <Line
            key={`M-${i}`}
            points={tick(3.4, 3.95, a)}
            color="#E6017A"
            lineWidth={1.5}
            transparent
            opacity={0.7}
          />
        ))}
        {/* Radar sweep */}
        <mesh ref={sweep} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={sweepGeo} attach="geometry" />
          <meshBasicMaterial
            color="#E6017A"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Center hub */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#E6017A" />
        </mesh>
        {/* Cross needle */}
        <Line
          points={[
            [-3.6, 0, 0],
            [3.6, 0, 0],
          ]}
          color="#ffffff"
          lineWidth={1}
          transparent
          opacity={0.15}
        />
        <Line
          points={[
            [0, 0, -3.6],
            [0, 0, 3.6],
          ]}
          color="#ffffff"
          lineWidth={1}
          transparent
          opacity={0.15}
        />
        {/* Nodes — freight contacts on the radar */}
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color={i % 2 ? "#E6017A" : "#5E72FA"} />
          </mesh>
        ))}
      </group>
    </>
  );
}
