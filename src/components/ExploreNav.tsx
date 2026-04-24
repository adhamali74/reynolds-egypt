import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Anchor, Building2, Workflow, Mail, ArrowUpRight } from "lucide-react";
import { useT } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";

type Card = {
  to: string;
  titleKey: string;
  kickerKey: string;
  copyKey: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: "magenta" | "royal";
};

const CARDS: Card[] = [
  {
    to: "/services",
    titleKey: "nav.services",
    kickerKey: "explore.services.kicker",
    copyKey: "explore.services.copy",
    Icon: Anchor,
    accent: "magenta",
  },
  {
    to: "/about",
    titleKey: "nav.about",
    kickerKey: "explore.about.kicker",
    copyKey: "explore.about.copy",
    Icon: Building2,
    accent: "royal",
  },
  {
    to: "/how-it-works",
    titleKey: "nav.howItWorks",
    kickerKey: "explore.how.kicker",
    copyKey: "explore.how.copy",
    Icon: Workflow,
    accent: "magenta",
  },
  {
    to: "/contact",
    titleKey: "nav.contact",
    kickerKey: "explore.contact.kicker",
    copyKey: "explore.contact.copy",
    Icon: Mail,
    accent: "royal",
  },
];

export default function ExploreNav() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const t = useT();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Photo overlay — dark mode lets the desert highway photo bleed through at
  // mid-section; light mode uses a softer warm-white wash so cards stay fully
  // legible while still hinting at the photo beneath.
  const overlayBackground = isLight
    ? "linear-gradient(to bottom, rgba(248,249,250,0.82) 0%, rgba(248,249,250,0.58) 45%, rgba(248,249,250,0.88) 100%)"
    : "linear-gradient(to bottom, rgba(5,8,20,0.78) 0%, rgba(5,8,20,0.42) 45%, rgba(5,8,20,0.82) 100%)";

  return (
    <section
      id="explore"
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-24"
    >
      {/* Real photograph — blue Kenworth container truck on a sun-baked desert
          highway. Warm sandy tones echo the Services section palette while the
          subject matter (truck + container on open road) is distinct from it. */}
      <img
        src="/assets/backgrounds/explore-truck.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Gradient wash so cards stay legible — pale in light mode, navy in
          dark mode. Transitions smoothly with the theme toggle. */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-500"
        style={{ background: overlayBackground }}
        aria-hidden
      />
      {/* Soft edge vignette — darker in dark mode, lighter in light mode */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isLight
            ? "shadow-[inset_0_0_140px_rgba(200,210,225,0.55)]"
            : "shadow-[inset_0_0_160px_rgba(3,6,16,0.75)]"
        }`}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-12" />
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
            {t("explore.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {t("explore.title.part1")}{" "}
            <span className="gradient-text">{t("explore.title.highlight")}</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            {t("explore.intro")}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => {
            const accentGradient =
              c.accent === "magenta"
                ? "from-magenta-500/30 to-transparent"
                : "from-royal-400/30 to-transparent";
            const iconColor =
              c.accent === "magenta" ? "text-magenta-400" : "text-royal-300";
            const hoverBorder =
              c.accent === "magenta"
                ? "hover:border-magenta-500/40"
                : "hover:border-royal-400/40";
            return (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              >
                <Link
                  to={c.to}
                  className={`group relative block h-full overflow-hidden rounded-3xl border p-7 backdrop-blur-lg backdrop-saturate-150 transition-all duration-500 hover:-translate-y-1 ${
                    isLight
                      ? "border-[rgba(20,22,40,0.09)] bg-white/95 shadow-[0_10px_30px_-12px_rgba(20,22,40,0.12)] hover:bg-white hover:shadow-[0_28px_60px_-18px_rgba(230,1,122,0.25)]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:shadow-[0_30px_80px_-20px_rgba(230,1,122,0.18)]"
                  } ${hoverBorder}`}
                >
                  <div
                    className={`pointer-events-none absolute -inset-32 bg-gradient-radial ${accentGradient} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`}
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${
                        c.accent === "magenta"
                          ? "rgba(230,1,122,0.22)"
                          : "rgba(94,114,250,0.22)"
                      }, transparent 60%)`,
                    }}
                  />
                  <div className="relative z-10">
                    <div
                      className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 ${iconColor}`}
                    >
                      <c.Icon size={22} />
                    </div>
                    <div className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {t(c.kickerKey)}
                    </div>
                    <h3 className="mb-3 font-display text-2xl font-semibold text-white">
                      {t(c.titleKey)}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/55">
                      {t(c.copyKey)}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/70 transition group-hover:text-white">
                      {t("common.enter")}{" "}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
