import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

const IconInstagram = (p: { size?: number }) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
const IconFacebook = (p: { size?: number }) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconLinkedin = (p: { size?: number }) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SOCIALS = [
  { Icon: IconInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: IconFacebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: IconLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  const t = useT();

  const COMPANY = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.howItWorks"), to: "/how-it-works" },
    { label: t("nav.getQuote"), to: "/contact" },
  ];
  const SERVICES = [
    t("services.sea.title"),
    t("services.air.title"),
    t("services.land.title"),
    t("services.customs.title"),
    t("services.warehousing.title"),
    t("services.project.title"),
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink-950 pt-24">
      <div className="pointer-events-none absolute inset-0 animate-grain noise" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-magenta-500/60 to-transparent" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        {/* Brand row */}
        <div className="mb-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/assets/logo-icon.png"
                alt="Reynolds"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-[0.2em] text-white">
                  REYNOLDS
                </span>
                <span className="mt-1 text-[9px] font-medium tracking-[0.3em] text-white/50">
                  LOGISTICS &amp; FORWARDING
                </span>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              {t("footer.tagline")}
            </p>
          </div>
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", damping: 14, stiffness: 260 }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-magenta-500/50 hover:bg-magenta-500/10 hover:text-white"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 border-t border-white/10 py-14 md:grid-cols-3">
          <div>
            <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-white/40">
              {t("footer.section.company")}
            </div>
            <ul className="space-y-3 text-sm">
              {COMPANY.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-2 text-white/70 transition hover:text-white"
                  >
                    <span className="inline-block h-px w-3 bg-white/30 transition-all group-hover:w-6 group-hover:bg-magenta-500" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-white/40">
              {t("footer.section.services")}
            </div>
            <ul className="space-y-3 text-sm">
              {SERVICES.map((l) => (
                <li key={l}>
                  <Link
                    to="/services"
                    className="group inline-flex items-center gap-2 text-white/70 transition hover:text-white"
                  >
                    <span className="inline-block h-px w-3 bg-white/30 transition-all group-hover:w-6 group-hover:bg-royal-400" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-white/40">
              {t("footer.section.contact")}
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="mt-0.5 shrink-0 text-magenta-400" />
                <span>
                  {t("footer.address.line1")}
                  <br />
                  {t("footer.address.line2")}
                </span>
              </li>
              <li>
                <a
                  href="mailto:info@reynoldsegypt.com"
                  className="flex items-center gap-3 text-white/70 transition hover:text-white"
                >
                  <Mail size={16} className="shrink-0 text-magenta-400" />
                  info@reynoldsegypt.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+20034838515"
                  className="flex items-center gap-3 text-white/70 transition hover:text-white"
                >
                  <Phone size={16} className="shrink-0 text-magenta-400" />
                  03-4838515
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark — REYNOLDS is a trademark, stays English always.
            Uses the .reynolds-wordmark class so it stays visible in both
            light and dark modes (gradient flips with the theme). */}
        <div className="relative -mx-6 overflow-hidden sm:-mx-10">
          <div className="pointer-events-none select-none text-center font-display text-[clamp(3rem,18vw,16rem)] font-bold leading-none tracking-tighter">
            <span className="reynolds-wordmark">REYNOLDS</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-white/40 sm:flex-row">
          <p>{t("footer.rights")}</p>
          <p className="font-mono">{t("footer.crafted")}</p>
        </div>
      </div>
    </footer>
  );
}
