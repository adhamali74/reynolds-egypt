import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Globe2, Package, Headphones } from "lucide-react";
import SceneCanvas from "./scenes/SceneCanvas";
import NetworkGlobe from "./scenes/NetworkGlobe";
import { useT } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";
import ParticleField from "./ParticleField";

function AnimatedCount({ end, duration = 2.2, run }: { end: number; duration?: number; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      setN(Math.round(end * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, end, duration]);
  return <>{n.toLocaleString()}</>;
}

type Stat = {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  suffix: string;
  labelKey: string;
  copyKey: string;
};

const STATS: Stat[] = [
  {
    Icon: Clock,
    value: 7,
    suffix: "+",
    labelKey: "why.stat.experience.label",
    copyKey: "why.stat.experience.copy",
  },
  {
    Icon: Globe2,
    value: 500,
    suffix: "+",
    labelKey: "why.stat.partners.label",
    copyKey: "why.stat.partners.copy",
  },
  {
    Icon: Package,
    value: 15000,
    suffix: "+",
    labelKey: "why.stat.shipments.label",
    copyKey: "why.stat.shipments.copy",
  },
  {
    Icon: Headphones,
    value: 24,
    suffix: "/7",
    labelKey: "why.stat.support.label",
    copyKey: "why.stat.support.copy",
  },
];

function StatBlock({
  s,
  i,
  started,
}: {
  s: Stat;
  i: number;
  started: boolean;
}) {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800/40 p-7 transition hover:border-white/20 hover:bg-ink-800/60"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-magenta-500/10 blur-3xl transition group-hover:bg-magenta-500/20" />
      <div className="relative z-10 flex flex-col gap-5">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-magenta-500">
          <s.Icon size={20} />
        </div>
        <div className="flex items-baseline gap-1 font-display text-5xl font-semibold text-white sm:text-6xl">
          <AnimatedCount end={s.value} run={started} />
          <span className="text-magenta-500">{s.suffix}</span>
        </div>
        <div>
          <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-white/50">
            {t(s.labelKey)}
          </div>
          <p className="text-sm leading-relaxed text-white/55">{t(s.copyKey)}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyReynolds() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const t = useT();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      id="why"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-32"
    >
      <SceneCanvas cameraPos={[3, 0.6, 6]} fov={40} className="opacity-[0.45]">
        <NetworkGlobe />
      </SceneCanvas>
      <ParticleField isLight={isLight} radiusScale={1.4} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_20%,#0A0B14_85%)]" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-royal-400" />
            {t("why.eyebrow")}
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {t("why.title.part1")}{" "}
            <span className="gradient-text">{t("why.title.highlight")}</span>{" "}
            {t("why.title.part2")}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">
            {t("why.intro")}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatBlock key={s.labelKey} s={s} i={i} started={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
