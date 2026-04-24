import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Reynolds "logo + wordmark" texture, drawn onto a 2D canvas at runtime.
 *
 * Uses the icon-only logo (/assets/logo-icon.png — 800×800 square) composited
 * to the left of the "REYNOLDS" text, so the result reads like real ship /
 * container branding rather than a floating label.
 *
 * The logo image loads asynchronously; we draw the text-only fallback first,
 * then repaint + flag `needsUpdate` once the image resolves. R3F picks up the
 * change on the next frame, so no explicit re-render is required.
 */
function makeReynoldsTexture({
  w = 1024,
  h = 256,
  fontSize = 160,
  logoScale = 0.78,
  color = "#ffffff",
}: {
  w?: number;
  h?: number;
  fontSize?: number;
  /** Logo height as a fraction of canvas height. */
  logoScale?: number;
  color?: string;
} = {}): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;

  const logo = new Image();
  // Public-root-relative path — resolved against the site origin at runtime.
  logo.src = "/assets/logo-icon.png";

  const paint = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `bold ${fontSize}px Inter, 'Space Grotesk', system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const logoLoaded = logo.complete && logo.naturalWidth > 0;
    const textW = ctx.measureText("REYNOLDS").width;
    const logoH = logoLoaded ? h * logoScale : 0;
    const logoW = logoLoaded
      ? logoH * (logo.naturalWidth / logo.naturalHeight)
      : 0;
    const gap = logoLoaded ? fontSize * 0.25 : 0;
    const totalW = logoW + gap + textW;
    const startX = (w - totalW) / 2;

    if (logoLoaded) {
      ctx.drawImage(
        logo,
        startX,
        (h - logoH) / 2,
        logoW,
        logoH
      );
    }

    const textX = startX + logoW + gap;
    const textY = h / 2 + fontSize * 0.025;
    ctx.fillStyle = color;
    ctx.fillText("REYNOLDS", textX, textY);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 3;
    ctx.strokeText("REYNOLDS", textX, textY);

    tex.needsUpdate = true;
  };

  // Draw text-only immediately so the texture is never blank; repaint once
  // the logo resolves (or errors, in which case we just keep the text).
  paint();
  logo.addEventListener("load", paint);
  logo.addEventListener("error", paint);
  return tex;
}

const BODY_COLORS = [
  "#B81D45",
  "#0B3A73",
  "#E6017A",
  "#1E3FE0",
  "#2E7D57",
  "#C77A00",
  "#4A4F57",
  "#8B2C8E",
];

const CONTAINER_L = 2.6;
const CONTAINER_W = 1.1;
const CONTAINER_H = 1.15;

function seed(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Slot = {
  x: number;
  y: number;
  z: number;
  color: string;
};

function buildStack(): Slot[] {
  const slots: Slot[] = [];
  // 5 bays along ship (X), 2 rows across deck (Z), up to 3 high (Y).
  const bays = 5;
  const rows = 2;
  const maxTiers = 3;
  for (let b = 0; b < bays; b++) {
    for (let r = 0; r < rows; r++) {
      const tierLimit =
        seed(b * 13 + r * 7) < 0.35 ? maxTiers : seed(b + r * 3) < 0.6 ? 2 : 1;
      for (let t = 0; t < tierLimit; t++) {
        // Occasional gap at the top
        if (t === maxTiers - 1 && seed(b * 19 + r * 5 + t) < 0.4) continue;
        slots.push({
          x: (b - (bays - 1) / 2) * (CONTAINER_L + 0.15),
          z: (r - (rows - 1) / 2) * (CONTAINER_W + 0.12),
          y: t * (CONTAINER_H + 0.04),
          color: BODY_COLORS[Math.floor(seed(b * 31 + r * 11 + t * 3) * BODY_COLORS.length)],
        });
      }
    }
  }
  return slots;
}

function Container({
  slot,
  reynoldsTex,
}: {
  slot: Slot;
  reynoldsTex: THREE.Texture;
}) {
  const L = CONTAINER_L;
  const W = CONTAINER_W;
  const H = CONTAINER_H;
  const trim = new THREE.Color(slot.color).multiplyScalar(0.55).getHexString();
  const trimHex = `#${trim}`;

  const corrugations = useMemo(() => {
    const list: number[] = [];
    const step = 0.14;
    const count = Math.floor(L / step);
    for (let i = 1; i < count; i++) list.push(-L / 2 + i * step);
    return list;
  }, [L]);

  return (
    <group position={[slot.x, slot.y, slot.z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[L, H, W]} />
        <meshStandardMaterial
          color={slot.color}
          metalness={0.5}
          roughness={0.55}
          emissive={slot.color}
          emissiveIntensity={0.04}
        />
      </mesh>

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

      <mesh position={[0, H / 2 - 0.05, W / 2 + 0.009]}>
        <planeGeometry args={[L * 0.99, 0.055]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>
      <mesh position={[0, H / 2 - 0.05, -W / 2 - 0.009]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[L * 0.99, 0.055]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>
      <mesh position={[0, -H / 2 + 0.05, W / 2 + 0.009]}>
        <planeGeometry args={[L * 0.99, 0.055]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>
      <mesh position={[0, -H / 2 + 0.05, -W / 2 - 0.009]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[L * 0.99, 0.055]} />
        <meshBasicMaterial color={trimHex} />
      </mesh>

      {/* Doors end */}
      <mesh position={[L / 2 + 0.012, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[W * 0.98, H * 0.96]} />
        <meshStandardMaterial color={slot.color} metalness={0.45} roughness={0.65} />
      </mesh>
      <mesh position={[L / 2 + 0.014, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[W * 0.86, H * 0.88]} />
        <meshBasicMaterial color="#05060D" transparent opacity={0.3} />
      </mesh>

      {/* Corner castings */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sy) =>
          [-1, 1].map((sz) => (
            <mesh
              key={`${sx}${sy}${sz}`}
              position={[sx * (L / 2 - 0.09), sy * (H / 2 - 0.09), sz * (W / 2 - 0.09)]}
            >
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial color="#22252C" metalness={0.6} roughness={0.5} />
            </mesh>
          ))
        )
      )}

      {/* REYNOLDS wordmark on both long sides */}
      <mesh position={[0, 0, W / 2 + 0.013]}>
        <planeGeometry args={[L * 0.72, H * 0.48]} />
        <meshBasicMaterial map={reynoldsTex} transparent />
      </mesh>
      <mesh position={[0, 0, -W / 2 - 0.013]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[L * 0.72, H * 0.48]} />
        <meshBasicMaterial map={reynoldsTex} transparent />
      </mesh>
    </group>
  );
}

/**
 * Container-ship hull — tapered bow at +X, flat stern at -X, with a
 * superstructure (bridge) and funnel at the stern. Deck surface sits at y=0.
 */
function ShipHull({
  hullBrandingTex,
}: {
  hullBrandingTex: THREE.Texture;
}) {
  // Hull footprint as a 2D shape, extruded downward for depth
  const hullShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-8.5, -2.0);
    s.lineTo(6.5, -2.0);
    s.lineTo(8.8, 0);
    s.lineTo(6.5, 2.0);
    s.lineTo(-8.5, 2.0);
    s.lineTo(-9.0, 0);
    s.closePath();
    return s;
  }, []);

  return (
    <group>
      {/* Main hull body — black with red waterline band */}
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <extrudeGeometry
          args={[
            hullShape,
            { depth: 1.7, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 2 },
          ]}
        />
        <meshStandardMaterial color="#0f1120" metalness={0.55} roughness={0.45} />
      </mesh>

      {/* Waterline accent — thin red band */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <extrudeGeometry
          args={[
            hullShape,
            { depth: 0.12, bevelEnabled: false },
          ]}
        />
        <meshStandardMaterial color="#B81D45" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Deck plate (under containers) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[17.4, 3.8]} />
        <meshStandardMaterial color="#1b1e2a" metalness={0.35} roughness={0.65} />
      </mesh>

      {/* Hatch coamings — horizontal bars between container bays */}
      {[-6, -3.5, -1, 1.5, 4, 6].map((x, i) => (
        <mesh key={`coam-${i}`} position={[x, 0.06, 0]}>
          <boxGeometry args={[0.12, 0.12, 3.5]} />
          <meshStandardMaterial color="#2a2e3e" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}

      {/* Bridge / accommodation block at the stern */}
      <group position={[-7, 1.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 2.8, 2.6]} />
          <meshStandardMaterial color="#f0f0f2" metalness={0.2} roughness={0.45} />
        </mesh>
        {/* Windows band */}
        <mesh position={[0, 1.0, 1.31]}>
          <planeGeometry args={[1.9, 0.35]} />
          <meshBasicMaterial color="#0d1a35" />
        </mesh>
        <mesh position={[0, 0.3, 1.31]}>
          <planeGeometry args={[1.9, 0.25]} />
          <meshBasicMaterial color="#0d1a35" />
        </mesh>
        {/* Bridge wings */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[2.6, 0.22, 3.0]} />
          <meshStandardMaterial color="#e6e6e8" metalness={0.25} roughness={0.55} />
        </mesh>
      </group>

      {/* Funnel with magenta stack band */}
      <group position={[-7.4, 3.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.55, 1.4, 20]} />
          <meshStandardMaterial color="#15192a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.35, 20]} />
          <meshStandardMaterial color="#E6017A" metalness={0.45} roughness={0.5} />
        </mesh>
      </group>

      {/* Bow mast */}
      <mesh position={[7.6, 1.6, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3.0, 8]} />
        <meshStandardMaterial color="#d0d0d4" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Reynolds hull branding — logo + wordmark painted onto both long
          sides of the hull. Planes sit just outside the extruded hull body
          (z=±2 is the hull flat side; we offset by 0.02 so z-fighting is
          avoided without looking detached). */}
      <mesh position={[-0.5, -0.75, 2.02]}>
        <planeGeometry args={[7.2, 1.05]} />
        <meshBasicMaterial map={hullBrandingTex} transparent />
      </mesh>
      <mesh position={[-0.5, -0.75, -2.02]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[7.2, 1.05]} />
        <meshBasicMaterial map={hullBrandingTex} transparent />
      </mesh>
    </group>
  );
}

/**
 * Animated ocean plane — vertex displacement gives rolling waves.
 * Runs at a relatively low segment count so the CPU stays cool.
 */
function Ocean({ mood = "day" }: { mood?: "day" | "night" }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const geom = geomRef.current;
    if (!geom) return;
    const t = clock.elapsedTime;
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 0.35 + t * 1.1) * 0.22 +
        Math.cos(y * 0.5 + t * 0.9) * 0.14 +
        Math.sin((x + y) * 0.22 + t * 1.6) * 0.1;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  const color = mood === "night" ? "#081530" : "#0d2448";
  const emissive = mood === "night" ? "#0a122e" : "#0a1a3a";
  const emissiveIntensity = mood === "night" ? 0.45 : 0.25;

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.1, 0]}
      receiveShadow
    >
      <planeGeometry ref={geomRef} args={[110, 110, 80, 80]} />
      <meshStandardMaterial
        color={color}
        metalness={0.25}
        roughness={0.4}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

/**
 * A few elongated white foam streaks behind the ship.
 */
function Wake() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.children.forEach((m, i) => {
      const mesh = m as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(t * 1.4 + i) * 0.08;
    });
  });
  return (
    <group ref={ref} position={[-10, -1.95, 0]}>
      {[-1.2, -0.4, 0.4, 1.2].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-i * 0.4, 0, z]}>
          <planeGeometry args={[6 + i * 0.6, 0.35]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

type Props = {
  /** "day" keeps the original warm-sun lighting (Services section).
   *  "night" is a cooler, dusk-toned palette with magenta rim accent for
   *  the Explore section. */
  mood?: "day" | "night";
  /** Slight camera drift to give the scene life. */
  cameraDrift?: boolean;
};

export default function ShipAtSea({
  mood = "day",
  cameraDrift = false,
}: Props = {}) {
  const shipRef = useRef<THREE.Group>(null);
  const slots = useMemo(() => buildStack(), []);
  // Two variants of the logo+wordmark texture — different canvas aspect
  // ratios so the branding doesn't stretch when applied to the narrow hull
  // band vs. the near-square container side.
  const reynoldsTex = useMemo(() => makeReynoldsTexture(), []);
  const hullBrandingTex = useMemo(
    () =>
      makeReynoldsTexture({
        w: 1792,
        h: 256,
        fontSize: 170,
        logoScale: 0.88,
      }),
    []
  );

  // Gentle pitch/roll + heave so the ship feels alive at sea
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    if (shipRef.current) {
      shipRef.current.rotation.z = Math.sin(t * 0.5) * 0.025; // roll
      shipRef.current.rotation.x = Math.sin(t * 0.35 + 1) * 0.02; // pitch
      shipRef.current.position.y = Math.sin(t * 0.6) * 0.08 - 0.15;
    }
    if (cameraDrift) {
      // Very slow orbit + bob so the scene isn't static behind cards
      camera.position.x = Math.sin(t * 0.08) * 0.6;
      camera.position.y = 1.2 + Math.sin(t * 0.12) * 0.15;
      camera.lookAt(0, 0.2, 0);
    }
  });

  const night = mood === "night";
  const bg = night ? "#030814" : "#050a1a";
  const sunColor = night ? "#6f8bd9" : "#ffe9c9";
  const sunIntensity = night ? 0.6 : 1.3;
  const fillColor = night ? "#2a4fc9" : "#4a6bff";
  const fillIntensity = night ? 0.7 : 0.5;
  const accentIntensity = night ? 0.8 : 0.4;

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 14, 52]} />

      <ambientLight intensity={night ? 0.32 : 0.45} />
      {/* Key light — warm sun in day, cool moon-ish in night */}
      <directionalLight
        position={[10, 14, 6]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
      />
      {/* Cool fill from the left / sea reflection */}
      <directionalLight position={[-8, 4, -6]} intensity={fillIntensity} color={fillColor} />
      {/* Magenta rim accent — stronger at night to tie into the brand palette */}
      <pointLight position={[0, 6, 4]} intensity={accentIntensity} color="#E6017A" />
      {night && (
        <>
          {/* Secondary magenta glow low on the water, right side */}
          <pointLight position={[6, 0.4, 3]} intensity={0.6} color="#FF3FA1" distance={14} />
          {/* Cool blue rim from behind the bow to separate ship from fog */}
          <pointLight position={[-4, 2, -4]} intensity={0.5} color="#5E72FA" distance={18} />
        </>
      )}

      <Ocean mood={mood} />

      {/* Ship assembly, scaled & angled for a cinematic quarter-view */}
      <group
        ref={shipRef}
        position={[0, -0.8, 0]}
        rotation={[0.18, -0.45, 0]}
        scale={0.58}
      >
        <ShipHull hullBrandingTex={hullBrandingTex} />
        {/* Container stack on deck — deck surface at y≈0, boxes rest above */}
        <group position={[0, CONTAINER_H / 2 + 0.12, 0]}>
          {slots.map((s, i) => (
            <Container key={i} slot={s} reynoldsTex={reynoldsTex} />
          ))}
        </group>
        <Wake />
      </group>
    </>
  );
}
