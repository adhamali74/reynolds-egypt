import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Check,
  ChevronDown,
  FileText,
  Loader2,
  TrendingUp,
  Globe2,
  Users,
  Award,
  Upload,
  X,
} from "lucide-react";
import { useT } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";

// ─────────────────────────────────────────────────────────────────────────────
// Field helpers — same design language as GetAQuote
// ─────────────────────────────────────────────────────────────────────────────

type FieldName =
  | "fullName"
  | "email"
  | "phone"
  | "position"
  | "experience"
  | "linkedin"
  | "message";

type FormState = Record<FieldName, string>;

const EMPTY: FormState = {
  fullName: "",
  email: "",
  phone: "",
  position: "",
  experience: "",
  linkedin: "",
  message: "",
};

function fieldShellCls(active: boolean, isLight: boolean) {
  return [
    "relative flex w-full rounded-lg border transition-colors duration-200",
    isLight ? "bg-black/[0.03]" : "bg-white/[0.04]",
    active
      ? "border-magenta-500/90 shadow-[0_0_0_3px_rgba(230,1,122,0.12)]"
      : isLight
      ? "border-ink-200 hover:border-ink-400"
      : "border-white/15 hover:border-white/25",
  ].join(" ");
}

function floatingLabelCls(floated: boolean, isLight: boolean) {
  return [
    "pointer-events-none absolute top-[22px] origin-[inherit] select-none text-[14px]",
    "ltr:left-4 ltr:origin-left rtl:right-4 rtl:origin-right",
    "transition-[transform,color] duration-200 ease-out",
    floated
      ? "-translate-y-[20px] scale-[0.8] text-magenta-500 font-medium tracking-[0.04em]"
      : isLight
      ? "translate-y-0 scale-100 text-ink-400"
      : "translate-y-0 scale-100 text-white/45",
  ].join(" ");
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  as = "input",
}: {
  label: string;
  name: FieldName;
  type?: string;
  value: string;
  onChange: (n: FieldName, v: string) => void;
  required?: boolean;
  as?: "input" | "textarea";
}) {
  const [focus, setFocus] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const floated = focus || value.length > 0;
  const inputBase = [
    "peer w-full bg-transparent px-4 pt-[22px] pb-3 text-[15px] placeholder-transparent outline-none",
    isLight ? "text-ink-900" : "text-white",
  ].join(" ");

  return (
    <label className="block">
      <div className={fieldShellCls(focus, isLight)}>
        {as === "textarea" ? (
          <textarea
            name={name}
            required={required}
            value={value}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder=" "
            className={`${inputBase} min-h-[130px] resize-y`}
          />
        ) : (
          <input
            name={name}
            type={type}
            required={required}
            value={value}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder=" "
            className={inputBase}
          />
        )}
        <span className={floatingLabelCls(floated, isLight)}>{label}</span>
      </div>
    </label>
  );
}

type SelectOption = { value: string; label: string };

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const wrapRef = useRef<HTMLDivElement>(null);
  const floated = open || value.length > 0;
  const displayLabel = options.find((o) => o.value === value)?.label ?? value ?? "—";

  return (
    <div ref={wrapRef} className="relative">
      <div className={fieldShellCls(open, isLight)}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={[
            "flex w-full items-center justify-between gap-2 bg-transparent px-4 pt-[22px] pb-3 text-left text-[15px] outline-none",
            isLight ? "text-ink-900" : "text-white",
          ].join(" ")}
        >
          <span className={value ? (isLight ? "text-ink-900" : "text-white") : "text-transparent"}>
            {displayLabel}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={isLight ? "text-ink-400" : "text-white/55"}
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>
        <span className={floatingLabelCls(floated, isLight)}>{label}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
            className={[
              "absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto overflow-hidden rounded-xl border p-1.5 backdrop-blur-xl custom-scroll",
              isLight
                ? "border-ink-200 bg-white/95 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)]"
                : "border-white/10 bg-ink-900/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]",
            ].join(" ")}
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => { onChange(o.value); setOpen(false); }}
                    className={[
                      "flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition",
                      active
                        ? "bg-gradient-to-r from-magenta-500/20 to-royal-500/20 text-white"
                        : isLight
                        ? "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
                        : "text-white/75 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                  >
                    <span>{o.label}</span>
                    {active && <Check size={14} className="text-magenta-400" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CV Upload drop zone
// ─────────────────────────────────────────────────────────────────────────────

function CvUpload({
  file,
  onFile,
  onRemove,
}: {
  file: File | null;
  onFile: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const t = useT();

  const accept = (files: FileList | null) => {
    if (!files?.length) return;
    const f = files[0];
    const ok = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(f.type) || /\.(pdf|doc|docx)$/i.test(f.name);
    if (!ok) return;
    if (f.size > 5 * 1024 * 1024) return; // 5 MB cap
    onFile(f);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-magenta-500/40 bg-magenta-500/[0.06] px-4 py-3">
        <FileText size={18} className="shrink-0 text-magenta-400" />
        <span className={`flex-1 truncate text-sm ${isLight ? "text-ink-700" : "text-white/80"}`}>
          <span className={isLight ? "text-ink-400" : "text-white/45"}>
            {t("careers.form.cvSelected")}{" "}
          </span>
          {file.name}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className={[
            "shrink-0 rounded-full p-1 transition",
            isLight
              ? "text-ink-400 hover:bg-ink-100 hover:text-ink-700"
              : "text-white/40 hover:bg-white/10 hover:text-white",
          ].join(" ")}
          aria-label={t("careers.form.cvRemove")}
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files); }}
      className={[
        "flex w-full flex-col items-center gap-3 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors duration-200",
        dragging
          ? "border-magenta-500/70 bg-magenta-500/10"
          : isLight
          ? "border-ink-300 bg-ink-50 hover:border-ink-400 hover:bg-ink-100"
          : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      <Upload size={24} className={dragging ? "text-magenta-400" : isLight ? "text-ink-400" : "text-white/35"} />
      <div>
        <p className={`text-sm ${isLight ? "text-ink-600" : "text-white/70"}`}>{t("careers.form.cvDrop")}</p>
        <p className={`mt-1 text-[11px] ${isLight ? "text-ink-400" : "text-white/35"}`}>{t("careers.form.cvHint")}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(e) => accept(e.target.files)}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Particle network canvas — drifting nodes that form lines when close.
// Pure 2-D canvas: lightweight, distinct from every other 3-D scene on the site.
// ─────────────────────────────────────────────────────────────────────────────

const PALETTE_DARK = [
  "rgba(230,1,122,",   // magenta
  "rgba(94,114,250,",  // royal blue
  "rgba(255,255,255,", // white
];
const PALETTE_LIGHT = [
  "rgba(230,1,122,",   // magenta
  "rgba(94,114,250,",  // royal blue
  "rgba(80,80,160,",   // muted indigo
];

function ParticleField({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number; col: string; a: number };
    let particles: P[] = [];
    const PALETTE = isLight ? PALETTE_LIGHT : PALETTE_DARK;

    const seed = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      const count = Math.round((W * H) / 12000);
      particles = Array.from({ length: Math.min(Math.max(count, 32), 100) }, () => {
        const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        return {
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          r:  Math.random() * 1.8 + 0.9,
          col,
          // 0.55 – 0.95 in dark, 0.45 – 0.80 in light (dots already visible on light bg)
          a:  isLight
            ? Math.random() * 0.35 + 0.45
            : Math.random() * 0.4  + 0.55,
        };
      });
    };

    const LINK_DIST = 155;
    const LINE_COL  = isLight ? "rgba(120,90,200," : "rgba(200,160,255,";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            // 0.45 in dark, 0.30 in light (lines are already more visible on light bg)
            const alpha = (1 - dist / LINK_DIST) * (isLight ? 0.30 : 0.45);
            ctx.beginPath();
            ctx.strokeStyle = `${LINE_COL}${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.col}${p.a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    seed();
    draw();

    const onResize = () => { seed(); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [isLight]);

  // No opacity class — full opacity so particles are always visible
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Benefits
// ─────────────────────────────────────────────────────────────────────────────

const BENEFITS = [
  { Icon: TrendingUp, titleKey: "careers.benefit.growth.title", copyKey: "careers.benefit.growth.copy", accent: "magenta" as const },
  { Icon: Globe2,     titleKey: "careers.benefit.impact.title",  copyKey: "careers.benefit.impact.copy",  accent: "royal"   as const },
  { Icon: Users,      titleKey: "careers.benefit.culture.title", copyKey: "careers.benefit.culture.copy", accent: "magenta" as const },
  { Icon: Award,      titleKey: "careers.benefit.perks.title",   copyKey: "careers.benefit.perks.copy",   accent: "royal"   as const },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────

export default function Careers() {
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef   = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const formInView   = useInView(formRef,   { once: true, margin: "-80px" });
  const t = useT();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [state, setState] = useState<FormState>(EMPTY);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const update = (name: FieldName, value: string) =>
    setState((s) => ({ ...s, [name]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("done");
      window.setTimeout(() => {
        setState(EMPTY);
        setCvFile(null);
        setStatus("idle");
      }, 3000);
    }, 1600);
  };

  const positionOptions: SelectOption[] = [
    { value: "sea",       label: t("careers.position.sea") },
    { value: "air",       label: t("careers.position.air") },
    { value: "land",      label: t("careers.position.land") },
    { value: "customs",   label: t("careers.position.customs") },
    { value: "warehouse", label: t("careers.position.warehouse") },
    { value: "sales",     label: t("careers.position.sales") },
    { value: "cs",        label: t("careers.position.cs") },
    { value: "ops",       label: t("careers.position.ops") },
    { value: "finance",   label: t("careers.position.finance") },
    { value: "general",   label: t("careers.position.general") },
  ];

  const experienceOptions: SelectOption[] = [
    { value: "fresh", label: t("careers.experience.fresh") },
    { value: "1to3",  label: t("careers.experience.1to3") },
    { value: "3to5",  label: t("careers.experience.3to5") },
    { value: "5to10", label: t("careers.experience.5to10") },
    { value: "10plus",label: t("careers.experience.10plus") },
  ];

  // Shared pill eyebrow classes
  const eyebrowPill = [
    "mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em]",
    isLight
      ? "border-ink-200 bg-ink-100 text-ink-500"
      : "border-white/10 bg-white/[0.03] text-white/60",
  ].join(" ");

  return (
    <div>
      {/* ── Hero + Benefits ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 py-32">
        {/* Particle network — covers the entire hero */}
        <ParticleField isLight={isLight} />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-10" />
        {/* Colour blooms */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-magenta-500/10 blur-[160px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-royal-500/10 blur-[160px]" />
        {/* Vignette — lighter in light mode so it doesn't fight the bright bg */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isLight
              ? "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(240,238,255,0.35) 100%)"
              : "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(5,6,13,0.55) 100%)",
          }}
        />

        <div ref={headerRef} className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl"
          >
            <div className={eyebrowPill}>
              <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
              {t("careers.eyebrow")}
            </div>
            <h1 className={`font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl ${isLight ? "text-ink-900" : "text-white"}`}>
              {t("careers.title.part1")}{" "}
              <span className="gradient-text">{t("careers.title.highlight")}</span>
            </h1>
            <p className={`mt-6 max-w-xl text-base leading-relaxed ${isLight ? "text-ink-600" : "text-white/55"}`}>
              {t("careers.intro")}
            </p>
          </motion.div>

          {/* Benefits grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ Icon, titleKey, copyKey, accent }, i) => {
              const glow = accent === "magenta"
                ? "group-hover:shadow-glow group-hover:border-magenta-500/40"
                : "group-hover:shadow-glowBlue group-hover:border-royal-400/40";
              const iconColor = accent === "magenta" ? "text-magenta-500" : "text-royal-400";
              return (
                <motion.div
                  key={titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                  className={[
                    "group relative overflow-hidden rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1",
                    isLight
                      ? "border-ink-200 bg-white/70"
                      : "border-white/10 bg-ink-800/40",
                    glow,
                  ].join(" ")}
                >
                  <div className="noise" />
                  <div
                    className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${
                        accent === "magenta" ? "rgba(230,1,122,0.18)" : "rgba(94,114,250,0.18)"
                      }, transparent 65%)`,
                    }}
                  />
                  <div className={`relative z-10 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${iconColor} ${isLight ? "border-ink-200 bg-ink-100" : "border-white/10 bg-black/30"}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className={`relative z-10 mb-2 font-display text-lg font-semibold ${isLight ? "text-ink-900" : "text-white"}`}>
                    {t(titleKey)}
                  </h3>
                  <p className={`relative z-10 text-sm leading-relaxed ${isLight ? "text-ink-600" : "text-white/55"}`}>
                    {t(copyKey)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Application Form ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-900 py-32">
        {/* Particle network — covers the Apply Now section too */}
        <ParticleField isLight={isLight} />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-15" />
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />

        <div
          ref={formRef}
          className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 sm:px-10 lg:grid-cols-[0.75fr_1.25fr]"
        >
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className={eyebrowPill}>
              <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
              {t("careers.form.eyebrow")}
            </div>
            <h2 className={`font-display text-4xl font-semibold leading-tight sm:text-5xl ${isLight ? "text-ink-900" : "text-white"}`}>
              {t("careers.form.title.part1")}{" "}
              <span className="gradient-text">{t("careers.form.title.highlight")}</span>
            </h2>
            <p className={`mt-6 max-w-sm text-base leading-relaxed ${isLight ? "text-ink-600" : "text-white/55"}`}>
              {t("careers.form.intro")}
            </p>

            {/* Process steps */}
            <div className="mt-10 space-y-6">
              {[
                { n: "01", label: t("careers.form.step1") },
                { n: "02", label: t("careers.form.step2") },
                { n: "03", label: t("careers.form.step3") },
              ].map(({ n, label }) => (
                <div key={n} className="flex items-start gap-4">
                  <span className={[
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]",
                    isLight
                      ? "border-ink-200 bg-ink-100 text-ink-500"
                      : "border-white/10 bg-white/[0.03] text-white/50",
                  ].join(" ")}>
                    {n}
                  </span>
                  <p className={`pt-1 text-sm ${isLight ? "text-ink-700" : "text-white/65"}`}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className={[
              "relative overflow-hidden rounded-3xl border p-6 backdrop-blur-sm sm:p-10",
              isLight
                ? "border-ink-200 bg-white/75"
                : "border-white/10 bg-ink-900/60",
            ].join(" ")}
          >
            <div className="noise" />
            <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label={t("careers.form.fullName")} name="fullName" required value={state.fullName} onChange={update} />
              <Field label={t("careers.form.email")} name="email" type="email" required value={state.email} onChange={update} />
              <Field label={t("careers.form.phone")} name="phone" type="tel" value={state.phone} onChange={update} />
              <Field label={t("careers.form.linkedin")} name="linkedin" type="url" value={state.linkedin} onChange={update} />

              <SelectField
                label={t("careers.form.position")}
                value={state.position}
                options={positionOptions}
                onChange={(v) => update("position", v)}
              />
              <SelectField
                label={t("careers.form.experience")}
                value={state.experience}
                options={experienceOptions}
                onChange={(v) => update("experience", v)}
              />

              <div className="sm:col-span-2">
                <Field label={t("careers.form.message")} name="message" as="textarea" value={state.message} onChange={update} />
              </div>

              {/* CV Upload */}
              <div className="sm:col-span-2">
                <p className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${isLight ? "text-ink-400" : "text-white/40"}`}>
                  {t("careers.form.cv")}
                </p>
                <CvUpload
                  file={cvFile}
                  onFile={setCvFile}
                  onRemove={() => setCvFile(null)}
                />
              </div>

              {/* Submit row */}
              <div className="mt-2 flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className={`text-xs ${isLight ? "text-ink-400" : "text-white/40"}`}>
                  {t("careers.form.footnote")}
                </p>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={status !== "idle"}
                  className="relative inline-flex h-14 min-w-[220px] items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-8 text-base font-medium text-white shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)] disabled:opacity-80"
                >
                  <AnimatePresence mode="wait">
                    {status === "idle" && (
                      <motion.span key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="inline-flex items-center gap-2">
                        {t("careers.form.send")} <span data-mirror-on-rtl>→</span>
                      </motion.span>
                    )}
                    {status === "loading" && (
                      <motion.span key="load" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        {t("careers.form.sending")}
                      </motion.span>
                    )}
                    {status === "done" && (
                      <motion.span key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="inline-flex items-center gap-2">
                        <Check size={18} /> {t("careers.form.sent")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
