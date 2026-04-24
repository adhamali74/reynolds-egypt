import { useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import {
  Ship,
  Plane,
  Truck,
  Stamp,
  Warehouse,
  Construction,
} from "lucide-react";
import { useT } from "../i18n/LanguageContext";

type Service = {
  titleKey: string;
  copyKey: string;
  tag1Key: string;
  tag2Key: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: "magenta" | "royal";
};

const SERVICES: Service[] = [
  {
    titleKey: "services.sea.title",
    copyKey: "services.sea.copy",
    tag1Key: "services.sea.tag1",
    tag2Key: "services.sea.tag2",
    Icon: Ship,
    accent: "magenta",
  },
  {
    titleKey: "services.air.title",
    copyKey: "services.air.copy",
    tag1Key: "services.air.tag1",
    tag2Key: "services.air.tag2",
    Icon: Plane,
    accent: "royal",
  },
  {
    titleKey: "services.land.title",
    copyKey: "services.land.copy",
    tag1Key: "services.land.tag1",
    tag2Key: "services.land.tag2",
    Icon: Truck,
    accent: "magenta",
  },
  {
    titleKey: "services.customs.title",
    copyKey: "services.customs.copy",
    tag1Key: "services.customs.tag1",
    tag2Key: "services.customs.tag2",
    Icon: Stamp,
    accent: "royal",
  },
  {
    titleKey: "services.warehousing.title",
    copyKey: "services.warehousing.copy",
    tag1Key: "services.warehousing.tag1",
    tag2Key: "services.warehousing.tag2",
    Icon: Warehouse,
    accent: "magenta",
  },
  {
    titleKey: "services.project.title",
    copyKey: "services.project.copy",
    tag1Key: "services.project.tag1",
    tag2Key: "services.project.tag2",
    Icon: Construction,
    accent: "royal",
  },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-50, 50], [8, -8]), {
    damping: 18,
    stiffness: 220,
  });
  const rotY = useSpring(useTransform(x, [-50, 50], [-8, 8]), {
    damping: 18,
    stiffness: 220,
  });
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const t = useT();

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const accentClass =
    s.accent === "magenta"
      ? "from-magenta-500/30 to-transparent"
      : "from-royal-400/30 to-transparent";
  const glow =
    s.accent === "magenta"
      ? "group-hover:shadow-glow group-hover:border-magenta-500/40"
      : "group-hover:shadow-glowBlue group-hover:border-royal-400/40";
  const iconColor =
    s.accent === "magenta" ? "text-magenta-500" : "text-royal-400";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800/40 p-7 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 hover:-translate-y-1 hover:bg-ink-800/55 ${glow}`}
    >
      <div className="noise" />
      <div
        className={`pointer-events-none absolute -inset-40 bg-gradient-radial ${accentClass} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`}
        style={{
          background: `radial-gradient(circle at ${
            s.accent === "magenta" ? "30% 20%" : "70% 80%"
          }, ${s.accent === "magenta" ? "rgba(230,1,122,0.2)" : "rgba(94,114,250,0.2)"}, transparent 60%)`,
        }}
      />
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        <div
          className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 ${iconColor}`}
        >
          <s.Icon size={26} />
        </div>
        <h3 className="mb-3 font-display text-2xl font-semibold text-white">
          {t(s.titleKey)}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-white/55">
          {t(s.copyKey)}
        </p>
        <div className="flex flex-wrap gap-2">
          {[t(s.tag1Key), t(s.tag2Key)].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute right-6 top-6 text-[11px] font-mono tracking-widest text-white/25">
        0{i + 1}
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-80px" });
  const t = useT();
  // Keep the services array stable across re-renders so each card animates once.
  const services = useMemo(() => SERVICES, []);

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-ink-950 py-32"
    >
      {/* Real photograph — convoy of freight trucks at golden hour. Warm amber
          tones contrast with the cool blue palette in the Explore section so
          the two sections feel like genuinely different locations. */}
      <img
        src="/assets/backgrounds/services-trucks.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Primary darkening wash — lets card text stay readable while the warm
          photo colours bleed through at the mid-section. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,13,0.72) 0%, rgba(8,6,4,0.52) 42%, rgba(5,6,13,0.88) 100%)",
        }}
        aria-hidden
      />
      {/* Subtle warm amber colour cast — matches the golden-hour light in the
          photo so the overlay doesn't feel cold or disconnected. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 60% 40%, rgba(200,120,20,0.10) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      {/* Edge vignette — pulls the eye toward the centre where the cards sit. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,6,13,0.70)_100%)]" aria-hidden />
      {/* Fine grid texture — same treatment as other sections for brand consistency. */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.08]" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <div ref={headerRef} className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
              {t("services.eyebrow")}
            </div>
            <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              {t("services.title.part1")} <span className="gradient-text">{t("services.title.highlight")}</span>
              {t("services.title.part2")}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md text-base leading-relaxed text-white/55"
          >
            {t("services.intro")}
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.titleKey} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
