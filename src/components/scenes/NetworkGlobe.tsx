import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const R = 2.2;

function sph(lat: number, lon: number, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

const NODES: Array<{ lat: number; lon: number }> = [
  { lat: 31.2, lon: 29.9 }, // Alexandria
  { lat: 51.9, lon: 4.4 }, // Rotterdam
  { lat: 53.5, lon: 10.0 }, // Hamburg
  { lat: 25.2, lon: 55.3 }, // Dubai
  { lat: 19.0, lon: 72.8 }, // Mumbai
  { lat: 31.2, lon: 121.4 }, // Shanghai
  { lat: 22.3, lon: 114.1 }, // Hong Kong
  { lat: 1.35, lon: 103.8 }, // Singapore
  { lat: 35.0, lon: 139.7 }, // Tokyo
  { lat: 40.7, lon: -74.0 }, // New York
  { lat: 33.7, lon: -118.2 }, // Los Angeles
  { lat: -23.5, lon: -46.6 }, // Sao Paulo
  { lat: -33.9, lon: 18.4 }, // Cape Town
  { lat: 55.7, lon: 37.6 }, // Moscow
];

function arc(a: THREE.Vector3, b: THREE.Vector3, seg = 48) {
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + 0.9);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  return curve.getPoints(seg).map<[number, number, number]>((p) => [p.x, p.y, p.z]);
}

export default function NetworkGlobe() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => NODES.map((n) => sph(n.lat, n.lon)), []);
  const alex = nodes[0];
  const arcs = useMemo(() => nodes.slice(1).map((n) => arc(alex, n)), [nodes, alex]);
  const dotsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 1400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      positions[i * 3] = R * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = R * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = R * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);
  useFrame((_, d) => {
    if (group.current) {
      group.current.rotation.y += d * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 6]} intensity={0.6} />
      <group ref={group}>
        {/* Inner dark shell */}
        <mesh>
          <sphereGeometry args={[R - 0.02, 48, 48]} />
          <meshBasicMaterial color="#05060D" />
        </mesh>
        {/* Dot-matrix overlay */}
        <points geometry={dotsGeo}>
          <pointsMaterial
            color="#1E3FE0"
            size={0.022}
            transparent
            opacity={0.9}
            sizeAttenuation
          />
        </points>
        {/* Soft wireframe grid */}
        <mesh>
          <sphereGeometry args={[R + 0.02, 24, 18]} />
          <meshBasicMaterial color="#1E3FE0" wireframe transparent opacity={0.12} />
        </mesh>
        {/* Network arcs */}
        {arcs.map((pts, i) => (
          <Line
            key={i}
            points={pts}
            color="#E6017A"
            lineWidth={1.1}
            transparent
            opacity={0.55}
          />
        ))}
        {/* Nodes */}
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[i === 0 ? 0.08 : 0.055, 14, 14]} />
            <meshBasicMaterial color={i === 0 ? "#E6017A" : "#5E72FA"} />
          </mesh>
        ))}
      </group>
    </>
  );
}
