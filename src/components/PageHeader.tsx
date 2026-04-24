import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
};

/**
 * Shared hero-style header used at the top of every sub-page
 * (/services, /about, /how-it-works, /contact).
 */
export default function PageHeader({ eyebrow, title, copy }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const t = useT();
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-950 pb-16 pt-40 sm:pt-44"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={14} /> {t("common.backToHome")}
          </Link>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
            {eyebrow}
          </div>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {copy && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">
              {copy}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
