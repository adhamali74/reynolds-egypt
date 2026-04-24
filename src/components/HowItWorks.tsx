import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FileText, Route, PackageCheck } from "lucide-react";
import SceneCanvas from "./scenes/SceneCanvas";
import FlowLanes from "./scenes/FlowLanes";
import { useT } from "../i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  id: number;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  titleKey: string;
  copyKey: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    Icon: FileText,
    titleKey: "how.step1.title",
    copyKey: "how.step1.copy",
  },
  {
    id: 2,
    Icon: Route,
    titleKey: "how.step2.title",
    copyKey: "how.step2.copy",
  },
  {
    id: 3,
    Icon: PackageCheck,
    titleKey: "how.step3.title",
    copyKey: "how.step3.copy",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const t = useT();

  useGSAP(
    () => {
      if (!pathRef.current) return;
      const path = pathRef.current;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="how"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink-950 py-32"
    >
      <SceneCanvas cameraPos={[0, 1.2, 9]} fov={38} className="opacity-[0.4]">
        <FlowLanes />
      </SceneCanvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#05060D_90%)]" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
            {t("how.eyebrow")}
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {t("how.title.part1")}{" "}
            <span className="gradient-text">{t("how.title.highlight")}</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Animated path (desktop only) */}
          <svg
            viewBox="0 0 1200 220"
            className="pointer-events-none absolute left-0 right-0 top-24 hidden w-full md:block"
            fill="none"
          >
            <defs>
              <linearGradient id="flow" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#E6017A" />
                <stop offset="50%" stopColor="#8F9EFF" />
                <stop offset="100%" stopColor="#5E72FA" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d="M 120 110 C 300 10, 500 210, 700 110 S 1080 10, 1160 110"
              stroke="url(#flow)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <motion.ol
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="relative grid gap-8 md:grid-cols-3"
          >
            {STEPS.map((step, i) => (
              <motion.li
                key={step.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800/50 p-8 transition hover:border-white/20">
                  <div className="noise" />
                  <div className="mb-6 flex items-center justify-between">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-magenta-500/20 to-royal-500/20 text-white">
                      <step.Icon size={24} />
                    </div>
                    <div className="font-display text-5xl font-bold text-white/10">
                      0{step.id}
                    </div>
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-semibold text-white">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55">
                    {t(step.copyKey)}
                  </p>
                </div>
                {/* Node dot aligned to path */}
                <div className="absolute left-1/2 -top-3 hidden h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-magenta-500/40 bg-ink-900 md:flex">
                  <span className="h-2 w-2 rounded-full bg-magenta-500" />
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mx-auto mt-4 h-10 w-px bg-gradient-to-b from-magenta-500/50 to-transparent md:hidden" />
                )}
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
