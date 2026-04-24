import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { User } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

type Member = {
  nameKey: string;
  roleKey: string;
  /** Photo path. If omitted, a silhouette placeholder is rendered. */
  photo?: string;
  /** Marks the card as a "to-be-announced" slot with dimmer styling. */
  placeholder?: boolean;
};

// Drop real photos into /public/team/<name>.jpg — paths are resolved from the
// public root at runtime. Placeholder slots render a silhouette + TBD text.
const TEAM: Member[] = [
  {
    nameKey: "team.member.hussien.name",
    roleKey: "team.member.hussien.role",
    photo: "/team/hussien.jpg",
  },
  {
    nameKey: "team.member.israa.name",
    roleKey: "team.member.israa.role",
    photo: "/team/israa.png",
  },
  {
    nameKey: "team.member.abdalrahman.name",
    roleKey: "team.member.abdalrahman.role",
    photo: "/team/abdalrahman.png",
  },
  {
    nameKey: "team.member.tbd.name",
    roleKey: "team.member.tbd.role",
    placeholder: true,
  },
  {
    nameKey: "team.member.tbd.name",
    roleKey: "team.member.tbd.role",
    placeholder: true,
  },
  {
    nameKey: "team.member.tbd.name",
    roleKey: "team.member.tbd.role",
    placeholder: true,
  },
];

function Avatar({ member, name }: { member: Member; name: string }) {
  const [errored, setErrored] = useState(false);
  const showPhoto = !member.placeholder && member.photo && !errored;

  return (
    <div className="relative mx-auto h-[200px] w-[200px]">
      {/* Soft magenta glow behind the avatar on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-magenta-500/30 to-royal-500/30 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className={`relative h-full w-full overflow-hidden rounded-full border transition-all duration-500 ${
          member.placeholder
            ? "border-white/10 bg-white/[0.02]"
            : "border-white/15 bg-ink-800 group-hover:border-magenta-400/50"
        }`}
      >
        {showPhoto ? (
          <img
            src={member.photo}
            alt={name}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            <User size={84} strokeWidth={1.2} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const t = useT();

  return (
    <section
      id="team"
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-28"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
            {t("team.eyebrow")}
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {t("team.title.part1")}{" "}
            <span className="gradient-text">{t("team.title.highlight")}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/55">
            {t("team.intro")}
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
        >
          {TEAM.map((m, i) => {
            const name = t(m.nameKey);
            const role = t(m.roleKey);
            return (
              <motion.li
                key={`${m.nameKey}-${i}`}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                className="group"
              >
                <div
                  className={`relative overflow-hidden rounded-3xl border bg-ink-800/40 p-6 text-center transition-all duration-500 hover:-translate-y-1 ${
                    m.placeholder
                      ? "border-white/5 opacity-70"
                      : "border-white/10 hover:border-magenta-400/40 hover:bg-ink-800/60"
                  }`}
                >
                  <Avatar member={m} name={name} />
                  <div className="mt-5">
                    <div
                      className={`font-display text-lg font-semibold ${
                        m.placeholder ? "text-white/40" : "text-white"
                      }`}
                    >
                      {name}
                    </div>
                    <div
                      className={`mt-1 text-sm tracking-wide ${
                        m.placeholder ? "text-white/30" : "text-magenta-300"
                      }`}
                    >
                      {role}
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
