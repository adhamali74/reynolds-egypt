import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useT } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";

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
  const t = useT();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const overlayBackground = isLight
    ? "linear-gradient(to bottom, rgba(248,249,250,0.82) 0%, rgba(248,249,250,0.58) 45%, rgba(248,249,250,0.88) 100%)"
    : "linear-gradient(to bottom, rgba(5,8,20,0.78) 0%, rgba(5,8,20,0.42) 45%, rgba(5,8,20,0.82) 100%)";

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-ink-950"
    >
      {/* Hero photo */}
      <div className="absolute inset-0">
        <img
          src="/assets/backgrounds/hero-ship.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Theme-aware overlay — light wash in light mode, dark in dark mode */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-500"
        style={{ background: overlayBackground }}
      />
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />

      {/* Brand lockup — pinned to top-center of the full-width section */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute left-0 right-0 top-24 z-20 flex flex-col items-center text-center"
      >
        <img
          src="/assets/logo-icon.png"
          alt="Reynolds"
          className="mb-3 h-10 w-10 object-contain drop-shadow-[0_0_14px_rgba(230,1,122,0.5)]"
        />
        <div className="flex flex-col leading-none">
          <span
            className="font-display text-[clamp(1.2rem,2.5vw,2rem)] font-bold tracking-[0.22em] text-white"
            style={{ paddingLeft: "0.22em" }}
          >
            REYNOLDS
          </span>
          <span className="mt-1 text-[10px] font-medium tracking-[0.4em] text-white/50 sm:text-xs">
            LOGISTICS &amp; FORWARDING
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-24 pt-40 sm:px-10">

        <motion.h1
          className="max-w-5xl font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-semibold leading-[0.95] tracking-tight"
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
