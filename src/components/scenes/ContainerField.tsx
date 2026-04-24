import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeReynoldsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, "#ffffff");
  ctx.fillStyle = grad;
  ctx.font = "bold 160px Inter, 'Space Grotesk', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "8px";
  ctx.fillText("REYNOLDS", canvas.width / 2, canvas.height / 2 + 4);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 3;
  ctx.strokeText("REYNOLDS", canvas.width / 2, canvas.height / 2 + 4);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/**
 * A real ISO shipping container — approximated proportions of a 20ft / 40ft box:
 *   40ft:  ~12.2m L × 2.44m W × 2.59m H   (ratio 5.0 : 1.0 : 1.06)
 *   20ft:  ~ 6.06m L × 2.44m W × 2.59m H  (ratio 2.5 : 1.0 : 1.06)
 * Details modelled: corrugated side walls, double doors with locking bars at one end,
 * corner castings at all 8 corners, bottom side rails, painted body.
 */

type Variant = "40ft" | "20ft";

const BODY_COLORS = [
  "#B81D45", // maersk-ish deep red
  "#0B3A73", // evergreen-ish navy
  "#E6017A", // brand magenta
  "#1E3FE0", // brand royal
  "#2E7D57", // cargo green
  "#C77A00", // safety orange
  "#4A4F57", // graphite
  "#8B2C8E", // plum
];

const LENGTHS: Record<Variant, number> = { "40ft": 5.0, "20ft": 2.5 };
const WIDTH = 1.0;
const HEIGHT = 1.06;

type Placement = {
  x: number;
  z: number;
  stack: number;
  rotY: number;
  variant: Variant;
  color: string;
  phase: number;
  drift: number;
};

function seed(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function buildField(): Placement[] {
  const out: Placement[] = [];
  // Grid with small jitter — tight circular field to keep cargo centered.
  const cols = 4;
  const rows = 4;
  const maxRadius = 4.8;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const i = c * rows + r;
      if (seed(i) < 0.22) continue; // gaps
      const px = (c - (cols - 1) / 2) * 2.4 + (seed(i + 2) - 0.5) * 0.25;
      const pz = (r - (rows - 1) / 2) * 1.8 + (seed(i + 17) - 0.5) * 0.2;
      // Clip to circular dock footprint — keeps containers away from corners.
      if (Math.sqrt(px * px + pz * pz) > maxRadius) continue;
      const variant: Variant = seed(i + 11) < 0.55 ? "40ft" : "20ft";
      const stackCount = seed(i + 3) < 0.35 ? 2 : seed(i + 7) < 0.2 ? 3 : 1;
      for (let s = 0; s < stackCount; s++) {
        const rotY =
          (seed(i * 9 + s) < 0.5 ? 0 : Math.PI / 2) +
          (seed(i + s + 31) - 0.5) * 0.12;
        out.push({
          x: px,
          z: pz,
          stack: s,
          rotY,
          variant,
          color: BODY_COLORS[Math.floor(seed(i + s * 5 + 13) * BODY_COLORS.length)],
          phase: seed(i + s) * Math.PI * 2,
          drift: 0.05 + seed(i + s + 101) * 0.08,
        });
      }
    }
  }
  return out;
}

function Container({ p, reynoldsTex }: { p: Placement; reynoldsTex: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  const L = LENGTHS[p.variant];
  const W = WIDTH;
  const H = HEIGHT;

  const corrugations = useMemo(() => {
    const list: number[] = [];
    const step = 0.13;
    const count = Math.floor(L / step);
    for (let i = 1; i < count; i++) {
      list.push(-L / 2 + i * step);
    }
    return list;
  }, [L]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y =
      p.stack * (H + 0.02) + Math.sin(t * 0.5 + p.phase) * p.drift;
  });

  // Darker trim for recessed door panel / roof / rails
  const trim = new THREE.Color(p.color).multiplyScalar(0.55).getHexString();
  const trimHex = `#${trim}`;

  return (
    <group ref={ref} position={[p.x, 0, p.z]} rotation={[0, p.rotY, 0]}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[L, H, W]} />
        <meshStandardMaterial
          color={p.color}
          metalness={0.45}
          roughness={0.58}
          emissive={p.color}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Corrugated side ridges (both long sides) — thin vertical plates */}
      {corrugations.map((lx, i) => (
        <group key={i}>
          <mesh position={[lx, 0, W / 2 + 0.008]}>
            <planeGeometry args={[0.025, H * 0.86]} />
            <meshBasicMaterial color="#05060D" transparent opacity={0.45} />
          </mesh>
          <mesh position={[lx, 0, -W / 2 - 0.008]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.025, H * 0.86]} />
            <meshBasicMaterial color="#05060D" transparent opacity={0.45} />
          </mesh>
        </group>
      ))}

      {/* Top rail (darker band just below the roof) */}
      <mesh position={[0, H / 2 - 0.04, W / 2 + 0.009]}>
        <planeGeometry args={[L * 0.99, 0.05]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>
      <mesh position={[0, H / 2 - 0.04, -W / 2 - 0.009]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[L * 0.99, 0.05]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>

      {/* Bottom rail */}
      <mesh position={[0, -H / 2 + 0.04, W / 2 + 0.009]}>
        <planeGeometry args={[L * 0.99, 0.05]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>
      <mesh position={[0, -H / 2 + 0.04, -W / 2 - 0.009]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[L * 0.99, 0.05]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>

      {/* Doors at the +X end — two vertical panels */}
      {[-W / 4, W / 4].map((dz, i) => (
        <group key={i} position={[L / 2 + 0.012, 0, dz]}>
          <mesh>
            <planeGeometry args={[W / 2 - 0.02, H * 0.96]} />
            <meshStandardMaterial
              color={p.color}
              metalness={0.45}
              roughness={0.62}
            />
          </mesh>
          {/* Door recess border */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[W / 2 - 0.05, H * 0.92]} />
            <meshBasicMaterial color="#05060D" transparent opacity={0.35} />
          </mesh>
          {/* Locking bars (2 per door) */}
          <mesh position={[W / 10, 0, 0.003]}>
            <planeGeometry args={[0.03, H * 0.85]} />
            <meshBasicMaterial color={trimHex} />
          </mesh>
          <mesh position={[-W / 10, 0, 0.003]}>
            <planeGeometry args={[0.03, H * 0.85]} />
            <meshBasicMaterial color={trimHex} />
          </mesh>
          {/* Hinges top/bottom */}
          <mesh position={[(W / 4) * 0.8 * (i === 0 ? 1 : -1), H * 0.38, 0.004]}>
            <planeGeometry args={[0.05, 0.06]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh position={[(W / 4) * 0.8 * (i === 0 ? 1 : -1), -H * 0.38, 0.004]}>
            <planeGeometry args={[0.05, 0.06]} />
            <meshBasicMaterial color="#222" />
          </mesh>
        </group>
      ))}

      {/* Back end wall (opposite doors) */}
      <mesh position={[-L / 2 - 0.012, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[W * 0.99, H * 0.96]} />
        <meshStandardMaterial
          color={p.color}
          metalness={0.45}
          roughness={0.62}
        />
      </mesh>

      {/* Corner castings — 8 dark blocks at corners */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sy) =>
          [-1, 1].map((sz) => (
            <mesh
              key={`${sx}${sy}${sz}`}
              position={[sx * (L / 2 - 0.09), sy * (H / 2 - 0.09), sz * (W / 2 - 0.09)]}
            >
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial
                color="#22252C"
                metalness={0.6}
                roughness={0.5}
              />
            </mesh>
          ))
        )
      )}

      {/* REYNOLDS wordmark — centered on both long sides, proper texture */}
      <mesh position={[0, 0, W / 2 + 0.013]}>
        <planeGeometry args={[L * 0.72, H * 0.48]} />
        <meshBasicMaterial map={reynoldsTex} transparent />
      </mesh>
      <mesh position={[0, 0, -W / 2 - 0.013]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[L * 0.72, H * 0.48]} />
        <meshBasicMaterial map={reynoldsTex} transparent />
      </mesh>

      {/* Soft edge highlight — colored tint, not harsh black outlines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(L, H, W)]} />
        <lineBasicMaterial color={trimHex} transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
}

export default function ContainerField() {
  const field = useMemo(() => buildField(), []);
  const reynoldsTex = useMemo(() => makeReynoldsTexture(), []);
  const group = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.035;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.1}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-7, 4, -5]} intensity={0.45} color="#1E3FE0" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#E6017A" />

      <group ref={group} rotation={[0.55, 0.35, 0]} position={[0, -1.4, 0]} scale={0.55}>
        {/* Dock surface — circular so it doesn't bleed into viewport corners */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
          <circleGeometry args={[6.4, 64]} />
          <meshStandardMaterial
            color="#0B0D17"
            metalness={0.1}
            roughness={0.95}
          />
        </mesh>
        {/* Dock grid lines */}
        <gridHelper
          args={[12, 12, "#1E3FE0", "#1E3FE0"]}
          position={[0, -0.545, 0]}
        />

        {field.map((p, i) => (
          <Container key={i} p={p} reynoldsTex={reynoldsTex} />
        ))}
      </group>
    </>
  );
}
