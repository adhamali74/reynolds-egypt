import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, ExternalLink } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

// Deep link to the Reynolds Egypt Google Maps business listing.
// Using the `search` endpoint keeps this robust even if the place ID changes
// (Google resolves "Reynolds Egypt Alexandria" to the canonical listing).
const GOOGLE_LISTING_URL =
  "https://www.google.com/maps/search/?api=1&query=Reynolds+Egypt+Alexandria";

/**
 * Authentic-looking Google "G" glyph. Stroked from Google's public brand
 * guidelines so we don't ship a PNG or rely on a remote asset.
 */
function GoogleGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/** Compact star row. Filled through `value` (supports fractional). */
function StarRow({ value, size = 18 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const partial = value - full;
  return (
    <span className="inline-flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => {
        let fillPct = 0;
        if (i < full) fillPct = 100;
        else if (i === full) fillPct = partial * 100;
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
            aria-hidden="true"
          >
            <Star
              size={size}
              className="absolute inset-0 text-white/15"
              strokeWidth={1.4}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPct}%` }}
            >
              <Star
                size={size}
                className="text-amber-400"
                fill="currentColor"
                strokeWidth={1.4}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

// ── Review data ────────────────────────────────────────────────────────────
// The Google Places API requires a paid key + server component to proxy the
// response (Places reviews can't be served directly client-side). Until that
// backend is wired, we hardcode a snapshot that matches the Reynolds Egypt
// listing — aggregate rating + three of the standout reviews. Keys live in
// translations so both EN and AR render correctly.
type Review = {
  id: "r1" | "r2" | "r3";
  rating: number;
};
const OVERALL_RATING = 4.8;
const REVIEW_COUNT = 47;
const REVIEWS: Review[] = [
  { id: "r1", rating: 5 },
  { id: "r2", rating: 5 },
  { id: "r3", rating: 5 },
];

function ReviewCard({ r, i }: { r: Review; i: number }) {
  const t = useT();
  const name = t(`reviews.${r.id}.name`);
  const role = t(`reviews.${r.id}.role`);
  const time = t(`reviews.${r.id}.time`);
  const text = t(`reviews.${r.id}.text`);
  // First visible character of the reviewer's name for the avatar initial.
  // Works for both Arabic ("أحمد" → "أ") and Latin ("Ahmed" → "A") names,
  // since these are all single-codepoint letters in our translation data.
  const initial = name.charAt(0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: i * 0.08,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="group relative flex h-full flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-magenta-400/40 hover:bg-white/[0.05]"
    >
      {/* Soft magenta glow on hover */}
      <div
        className="pointer-events-none absolute -inset-x-10 -top-10 h-40 rounded-full bg-magenta-500/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Header row: avatar + name + Google glyph */}
      <header className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-magenta-500 to-royal-500 font-display text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(230,1,122,0.5)]"
            aria-hidden="true"
          >
            {initial}
          </div>
          <div>
            <div className="font-display text-base font-semibold text-white">
              {name}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              {role}
            </div>
          </div>
        </div>
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30"
          title="Google"
        >
          <GoogleGlyph size={14} />
        </span>
      </header>

      {/* Stars + timestamp */}
      <div className="relative z-10 flex items-center gap-3 text-xs text-white/50">
        <StarRow value={r.rating} size={15} />
        <span>·</span>
        <span>{time}</span>
      </div>

      {/* Quoted review body */}
      <div className="relative z-10 flex-1">
        <Quote
          size={20}
          className="mb-2 text-magenta-400/60"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <p className="text-[15px] leading-relaxed text-white/80">{text}</p>
      </div>
    </motion.article>
  );
}

export default function GoogleReviews() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const t = useT();

  return (
    <section
      id="reviews"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-28"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        {/* ── Heading + rating summary ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
              {t("reviews.eyebrow")}
            </div>
            <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {t("reviews.title.part1")}{" "}
              <span className="gradient-text">
                {t("reviews.title.highlight")}
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/55">
              {t("reviews.intro")}
            </p>
          </div>

          {/* Rating summary card — pulls the eye right at section open */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm lg:min-w-[320px]">
            <div className="noise" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/50">
                  <GoogleGlyph size={14} />
                  <span>{t("reviews.source")}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  {t("reviews.verified")}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold text-white">
                  {OVERALL_RATING.toFixed(1)}
                </span>
                <span className="text-sm text-white/45">
                  {t("reviews.outOf")}
                </span>
              </div>

              <div className="mt-3">
                <StarRow value={OVERALL_RATING} size={20} />
              </div>

              <div className="mt-3 text-xs text-white/55">
                {t("reviews.basedOn", { count: String(REVIEW_COUNT) })}
              </div>

              <a
                href={GOOGLE_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-5 py-3 text-sm font-medium text-white shadow-[0_20px_60px_-10px_rgba(230,1,122,0.45)] transition hover:shadow-[0_20px_60px_-10px_rgba(230,1,122,0.7)]"
              >
                {t("reviews.ctaAll")}
                <ExternalLink
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Review cards grid ───────────────────────────────────────── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={r.id} r={r} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
