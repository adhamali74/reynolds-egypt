import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useT } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";
import ParticleField from "./ParticleField";

export default function CEOQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const t = useT();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      id="ceo"
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-28"
    >
      <ParticleField isLight={isLight} radiusScale={1.4} />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-ink-900/80 to-ink-800/40 p-8 backdrop-blur-sm sm:p-14"
        >
          <div className="noise" />
          <Quote
            className="pointer-events-none absolute -left-2 -top-2 text-magenta-500/15"
            size={180}
            strokeWidth={1}
          />

          <div className="relative z-10 grid items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative mx-auto shrink-0"
              style={{ width: 176, height: 176 }}
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-magenta-500 to-royal-500 blur-xl opacity-60" />
              <span className="absolute inset-0 animate-pulse rounded-full border border-magenta-500/40" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/20 shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)]">
                <img
                  src="/assets/hussien.jpg"
                  alt={t("ceo.imageAlt")}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 18%" }}
                />
              </div>
            </motion.div>

            <div>
              <blockquote className="font-display text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl">
                {t("ceo.quote.1")}
                <span className="gradient-text">{t("ceo.quote.highlight")}</span>
                {t("ceo.quote.2")}
              </blockquote>
              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-magenta-500 to-royal-500" />
                <div>
                  <div className="text-base font-semibold text-white">
                    {t("ceo.name")}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/50">
                    {t("ceo.role")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
