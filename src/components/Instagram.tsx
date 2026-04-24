import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

/** Official Instagram glyph (camera outline). Uses currentColor so it can be
 *  recoloured via Tailwind text-* utilities. */
function InstagramIcon({
  size = 18,
  className,
  strokeWidth = 2,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const HANDLE = "reynoldsegypt";
const PROFILE_URL = `https://instagram.com/${HANDLE}`;

type Post = { src: string; captionKey: string; likes: string; comments: string };

const POSTS: Post[] = [
  // First row reads "REY" → "YNOL" → "DS" so the banner spells REYNOLDS.
  {
    src: "/assets/instagram/post-3.png",
    captionKey: "ig.post.1",
    likes: "2.1k",
    comments: "95",
  },
  {
    src: "/assets/instagram/post-2.png",
    captionKey: "ig.post.2",
    likes: "864",
    comments: "27",
  },
  {
    src: "/assets/instagram/post-1.png",
    captionKey: "ig.post.3",
    likes: "1.2k",
    comments: "48",
  },
  {
    src: "/assets/instagram/post-4.png",
    captionKey: "ig.post.4",
    likes: "732",
    comments: "19",
  },
  {
    src: "/assets/instagram/post-5.png",
    captionKey: "ig.post.5",
    likes: "1.5k",
    comments: "64",
  },
  {
    src: "/assets/instagram/post-6.png",
    captionKey: "ig.post.6",
    likes: "541",
    comments: "12",
  },
  {
    src: "/assets/instagram/post-7.png",
    captionKey: "ig.post.7",
    likes: "987",
    comments: "33",
  },
  {
    src: "/assets/instagram/post-8.png",
    captionKey: "ig.post.8",
    likes: "3.4k",
    comments: "156",
  },
  {
    src: "/assets/instagram/post-9.png",
    captionKey: "ig.post.9",
    likes: "1.8k",
    comments: "71",
  },
];

function PostTile({ post, i }: { post: Post; i: number }) {
  const t = useT();
  return (
    <motion.a
      href={PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative block aspect-square overflow-hidden rounded-2xl border border-white/10 bg-ink-800"
    >
      <img
        src={post.src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="mb-3 text-sm leading-snug text-white">{t(post.captionKey)}</p>
        <div className="flex items-center gap-4 text-[11px] text-white/75">
          <span className="inline-flex items-center gap-1.5">
            <Heart size={13} className="fill-magenta-500 text-magenta-500" />
            {post.likes}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={13} />
            {post.comments}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-white/60 transition group-hover:text-white">
            {t("common.viewProject")} <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function Instagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const t = useT();

  return (
    <section
      id="instagram"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-28"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("ig.followAria", { handle: HANDLE })}
              className="group mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:border-magenta-500/40 hover:bg-magenta-500/5 hover:text-white"
            >
              <InstagramIcon
                size={14}
                strokeWidth={2}
                className="text-magenta-300 transition group-hover:text-magenta-200"
              />
              <span>@{HANDLE}</span>
            </a>
            <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              {t("ig.title.part1")}{" "}
              <span className="gradient-text">{t("ig.title.highlight")}</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
              {t("ig.intro")}
            </p>
          </div>

          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 self-start rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-magenta-500/40 hover:bg-magenta-500/5 md:self-end"
          >
            <div className="relative h-12 w-12 shrink-0">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-magenta-500 to-royal-500 blur-md opacity-50" />
              <div className="relative h-full w-full overflow-hidden rounded-full border border-white/20">
                <img
                  src="/assets/insta-profile.png"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="pr-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <InstagramIcon
                  size={18}
                  strokeWidth={2}
                  className="text-magenta-300 transition group-hover:text-magenta-200"
                />
                <span>@{HANDLE}</span>
              </div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.22em] text-white/50">
                {t("ig.viewOn")}
              </div>
            </div>
            <ExternalLink
              size={16}
              className="text-white/60 transition group-hover:text-magenta-300"
            />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
          {POSTS.map((p, i) => (
            <PostTile key={i} post={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
