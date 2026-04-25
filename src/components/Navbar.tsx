import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "../theme/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();

  const LINKS = [
    { key: "nav.home", to: "/" },
    { key: "nav.services", to: "/services" },
    { key: "nav.about", to: "/about" },
    { key: "nav.howItWorks", to: "/how-it-works" },
    { key: "nav.contact", to: "/contact" },
    { key: "careers.eyebrow", to: "/careers" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const themeBtnCls =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/75 transition hover:border-magenta-500/40 hover:bg-magenta-500/10 hover:text-white";
  const langBtnCls =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-royal-400/40 hover:bg-royal-400/10 hover:text-white";

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <div
          className={clsx(
            "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8",
            scrolled
              ? "glass rounded-full border-white/10 py-2.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
              : "py-3"
          )}
        >
          <Link to="/" className="flex items-center gap-3 py-1">
            <img
              src="/assets/logo-icon.png"
              alt="Reynolds"
              className="h-8 w-8 object-contain"
            />
            <div className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[15px] font-bold tracking-[0.2em] text-white">
                REYNOLDS
              </span>
              <span className="mt-0.5 text-[9px] font-medium tracking-[0.3em] text-white/50">
                LOGISTICS &amp; FORWARDING
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  clsx(
                    "group relative rounded-full px-4 py-2 text-sm transition",
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t(link.key)}
                    <span
                      className={clsx(
                        "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gradient-to-r from-magenta-500 to-royal-400 transition-transform duration-500",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("nav.toggleTheme")}
              title={t("nav.toggleTheme")}
              className={themeBtnCls}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex"
                  >
                    <Moon size={15} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex"
                  >
                    <Sun size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={t("nav.toggleLanguage")}
              title={t("nav.toggleLanguage")}
              className={langBtnCls}
            >
              <Globe size={13} className="text-white/60" />
              <span>{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* CTA */}
            <Link
              to="/contact"
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow transition hover:shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)]"
            >
              <span className="relative z-10">{t("nav.getQuote")}</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-royal-500 to-magenta-500 transition-transform duration-500 group-hover:translate-x-0" />
              <span
                className="relative z-10 ml-2 transition-transform group-hover:translate-x-1"
                data-mirror-on-rtl
              >
                →
              </span>
            </Link>
          </div>

          {/* Mobile: theme + language toggles + burger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("nav.toggleTheme")}
              className={themeBtnCls}
            >
              {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button
              type="button"
              onClick={toggleLang}
              aria-label={t("nav.toggleLanguage")}
              className={langBtnCls}
            >
              <Globe size={13} className="text-white/60" />
              <span>{lang === "ar" ? "EN" : "AR"}</span>
            </button>
            <button
              aria-label={t("nav.openMenu")}
              onClick={() => setOpen(true)}
              className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="relative m-3 rounded-3xl border border-white/10 bg-ink-900/95 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <img
                  src="/assets/logo-icon.png"
                  alt="Reynolds"
                  className="h-8 w-8 object-contain"
                />
                <button
                  aria-label={t("nav.closeMenu")}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                className="space-y-1"
              >
                {LINKS.map((link) => (
                  <motion.li
                    key={link.to}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      onClick={() => setOpen(false)}
                      to={link.to}
                      className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg text-white/90 hover:bg-white/5"
                    >
                      <span>{t(link.key)}</span>
                      <span className="text-white/30" data-mirror-on-rtl>→</span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-4 block rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-5 py-3 text-center text-sm font-medium text-white"
              >
                {t("nav.getQuote")}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
