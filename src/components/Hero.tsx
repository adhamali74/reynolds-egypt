import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { ArrowRight, ChevronDown } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";
import { useT } from "../i18n/LanguageContext";

function Globe() {
  const group = useRef<THREE.Group>(null);
  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#1E3FE0"),
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      }),
    []
  );
  const dotsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 1600;
    const positions = new Float32Array(count * 3);
    const radius = 2.05;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#E6017A"),
        size: 0.025,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = Math.sin(Date.now() * 0.00012) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh material={wireMat}>
        <icosahedronGeometry args={[2, 4]} />
      </mesh>
      <points geometry={dotsGeo} material={pointsMat} />
      {/* Inner faint shell */}
      <mesh>
        <sphereGeometry args={[1.98, 48, 48]} />
        <meshBasicMaterial
          color="#05060D"
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function OrbitLines() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y -= d * 0.05;
  });
  const lines = useMemo(
    () => [
      { radius: 2.6, tilt: 0.3, color: "#E6017A" },
      { radius: 2.9, tilt: -0.4, color: "#5E72FA" },
      { radius: 3.2, tilt: 0.1, color: "#E6017A" },
    ],
    []
  );
  const pointsArrays = useMemo(
    () =>
      lines.map((l) => {
        const pts: [number, number, number][] = [];
        const segs = 128;
        for (let j = 0; j <= segs; j++) {
          const t = (j / segs) * Math.PI * 2;
          pts.push([Math.cos(t) * l.radius, 0, Math.sin(t) * l.radius]);
        }
        return pts;
      }),
    [lines]
  );
  return (
    <group ref={ref}>
      {lines.map((l, i) => (
        <group key={i} rotation={[l.tilt, i * 0.8, i * 0.4]}>
          <Line
            points={pointsArrays[i]}
            color={l.color}
            lineWidth={1}
            transparent
            opacity={0.35}
          />
        </group>
      ))}
    </group>
  );
}

const MotionLink = motion(Link);

function MagneticButton({
  children,
  primary,
  to,
}: {
  children: React.ReactNode;
  primary?: boolean;
  to: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 14, stiffness: 180 });
  const sy = useSpring(y, { damping: 14, stiffness: 180 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.3);
    y.set(relY * 0.4);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={ref}
      to={to}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.96 }}
      className={
        primary
          ? "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-7 py-4 text-base font-medium text-white shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)]"
          : "group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-7 py-4 text-base font-medium text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/[0.06]"
      }
    >
      {primary && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-royal-500 to-magenta-500 transition-transform duration-500 group-hover:translate-x-0" />
      )}
      <span className="relative z-10">{children}</span>
      <ArrowRight
        size={18}
        className="relative z-10 transition-transform group-hover:translate-x-1"
      />
    </MotionLink>
  );
}

const HEADLINE_KEYS = [
  "hero.headline.1",
  "hero.headline.2",
  "hero.headline.3",
  "hero.headline.4",
  "hero.headline.5",
];
// Which headline slot gets the gradient highlight — last word ("World.")
const HIGHLIGHT_INDEX = 4;

export default function Hero() {
  const parallaxY = useMotionValue(0);
  const parallax = useTransform(parallaxY, [0, 400], [0, -80]);
  const t = useT();

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-ink-950"
      onMouseMove={(e) => parallaxY.set(e.clientY)}
    >
      {/* Background canvas */}
      <div className="absolute inset-0">
        <ErrorBoundary
          fallback={
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(94,114,250,0.12),transparent_65%),radial-gradient(ellipse_at_70%_70%,rgba(230,1,122,0.1),transparent_60%)]" />
          }
        >
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 45 }}
            dpr={[1, 1.8]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;
              canvas.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
            }}
          >
            <ambientLight intensity={0.5} />
            <Suspense fallback={null}>
              <Globe />
              <OrbitLines />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Vignette + grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#05060D_85%)]" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-24 pt-40 sm:px-10">
        <motion.h1
          style={{ y: parallax }}
          className="max-w-5xl font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tight"
        >
          <motion.span
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.11 } } }}
            className="inline"
          >
            {HEADLINE_KEYS.map((key, i) => (
              <motion.span
                key={key}
                variants={{
                  hidden: { opacity: 0, y: "0.6em", rotateX: -30 },
                  visible: { opacity: 1, y: 0, rotateX: 0 },
                }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className={`mr-3 inline-block ${
                  i === HIGHLIGHT_INDEX ? "gradient-text" : "text-white"
                }`}
                style={{ transformOrigin: "bottom" }}
              >
                {t(key)}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>

        {/* Brand lockup — logo + name + slogan, sits just below the headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-8 inline-flex items-center gap-4"
        >
          <img
            src="/assets/logo-icon.png"
            alt="Reynolds"
            className="h-14 w-14 object-contain drop-shadow-[0_0_18px_rgba(230,1,122,0.45)]"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-3xl font-bold tracking-[0.22em] text-white sm:text-4xl">
              REYNOLDS
            </span>
            <span className="mt-1.5 text-[11px] font-medium tracking-[0.35em] text-white/50 sm:text-xs">
              LOGISTICS &amp; FORWARDING
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
        >
          {t("hero.copy")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton primary to="/contact">
            {t("hero.ctaPrimary")}
          </MagneticButton>
          <MagneticButton to="/services">{t("hero.ctaSecondary")}</MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-20 flex items-center gap-8 text-xs uppercase tracking-[0.25em] text-white/40"
        >
          <span>{t("hero.tag.sea")}</span>
          <span className="h-px w-8 bg-white/20" />
          <span>{t("hero.tag.air")}</span>
          <span className="h-px w-8 bg-white/20" />
          <span>{t("hero.tag.land")}</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#explore"
        aria-label={t("hero.scroll")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.a>
    </section>
  );
}
