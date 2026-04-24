import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Check,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import SceneCanvas from "./scenes/SceneCanvas";
import CompassScene from "./scenes/CompassScene";
import { useT } from "../i18n/LanguageContext";

// ──────────────────────────────────────────────────────────────────────────
// Field names + form state
// ──────────────────────────────────────────────────────────────────────────

type FieldName =
  | "fullName"
  | "company"
  | "email"
  | "phone"
  | "shipmentType"
  | "origin"
  | "destination"
  | "message";

type FormState = Record<FieldName, string>;

const EMPTY: FormState = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  shipmentType: "Sea",
  origin: "",
  destination: "",
  message: "",
};

// ──────────────────────────────────────────────────────────────────────────
// Data — all countries (ISO English short names) + major port cities
// ──────────────────────────────────────────────────────────────────────────

const COUNTRIES: string[] = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas",
  "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica",
  "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
].sort((a, b) => a.localeCompare(b));

const PORT_CITIES: string[] = [
  // Europe
  "Rotterdam", "Antwerp", "Hamburg", "Bremerhaven", "Felixstowe", "Amsterdam",
  "Valencia", "Barcelona", "Piraeus", "Istanbul", "Genoa", "Algeciras",
  "Le Havre", "Gothenburg", "Gioia Tauro", "Marseille", "Southampton",
  "Gdansk", "Constanta", "Marsaxlokk", "Lisbon", "Koper", "Rijeka",
  "Thessaloniki",
  // Middle East
  "Jebel Ali (Dubai)", "Jeddah", "King Abdullah Port", "Salalah", "Djibouti",
  "Muscat", "Bahrain", "Kuwait",
  // Asia
  "Singapore", "Shanghai", "Ningbo-Zhoushan", "Busan", "Shenzhen",
  "Guangzhou", "Hong Kong", "Kaohsiung", "Port Klang", "Tanjung Pelepas",
  "Laem Chabang", "Ho Chi Minh City", "Mumbai (Nhava Sheva)", "Mundra",
  "Colombo", "Chittagong", "Karachi", "Yokohama", "Tokyo", "Kobe",
  "Qingdao", "Tianjin", "Xiamen", "Dalian", "Tanjung Priok (Jakarta)",
  // Africa
  "Durban", "Cape Town", "Tangier Med", "Mombasa", "Dar es Salaam",
  "Lagos (Apapa/Tin Can)", "Tema", "Abidjan", "Lomé", "Maputo",
  // Americas
  "Los Angeles", "Long Beach", "New York/New Jersey", "Savannah", "Houston",
  "Charleston", "Santos", "Buenos Aires", "Cartagena", "Manzanillo (Mexico)",
  "Colón (Panama)", "Callao", "Vancouver", "Montreal", "Kingston (Jamaica)",
  // Oceania
  "Melbourne", "Sydney", "Brisbane", "Auckland", "Tauranga",
  // Egypt
  "Port Said", "Damietta", "Alexandria", "El Dekheila", "Ain Sokhna",
  "Safaga", "Adabiya", "Suez", "East Port Said",
].sort((a, b) => a.localeCompare(b));

// ──────────────────────────────────────────────────────────────────────────
// Shared field shell — bordered rounded container with focus accent
// ──────────────────────────────────────────────────────────────────────────

function fieldShellCls(active: boolean) {
  return [
    "relative flex w-full rounded-lg border bg-white/[0.04] transition-colors duration-200",
    active
      ? "border-magenta-500/90 shadow-[0_0_0_3px_rgba(230,1,122,0.12)]"
      : "border-white/15 hover:border-white/25",
  ].join(" ");
}

function floatingLabelCls(floated: boolean) {
  return [
    "pointer-events-none absolute top-[22px] origin-[inherit] select-none text-[14px]",
    "ltr:left-4 ltr:origin-left rtl:right-4 rtl:origin-right",
    "transition-[transform,color] duration-200 ease-out",
    floated
      ? "-translate-y-[20px] scale-[0.8] text-magenta-300 font-medium tracking-[0.04em]"
      : "translate-y-0 scale-100 text-white/45",
  ].join(" ");
}

// ──────────────────────────────────────────────────────────────────────────
// Plain text field (input or textarea)
// ──────────────────────────────────────────────────────────────────────────

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
  const floated = focus || value.length > 0;
  const active = focus;

  const inputBase =
    "peer w-full bg-transparent px-4 pt-[22px] pb-3 text-[15px] text-white placeholder-transparent outline-none";

  return (
    <label className="block">
      <div className={fieldShellCls(active)}>
        {as === "textarea" ? (
          <textarea
            name={name}
            required={required}
            value={value}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder=" "
            className={`${inputBase} min-h-[120px] resize-y`}
            style={{ resize: "vertical" }}
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
        <span className={floatingLabelCls(floated)}>{label}</span>
      </div>
    </label>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Simple (non-searchable) dropdown — for Shipment Type
// ──────────────────────────────────────────────────────────────────────────

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const floated = open || value.length > 0;
  const displayLabel =
    options.find((o) => o.value === value)?.label ?? value ?? "—";

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <div className={fieldShellCls(open)}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 bg-transparent px-4 pt-[22px] pb-3 text-left text-[15px] text-white outline-none"
        >
          <span className={value ? "text-white" : "text-transparent"}>
            {displayLabel}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/55"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>
        <span className={floatingLabelCls(floated)}>{label}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 p-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition ${
                      active
                        ? "bg-gradient-to-r from-magenta-500/20 to-royal-500/20 text-white"
                        : "text-white/75 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span>{o.label}</span>
                    {active && <Check size={14} className="text-magenta-300" />}
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

// ──────────────────────────────────────────────────────────────────────────
// Searchable dropdown — for Origin (countries) + Destination (ports)
// ──────────────────────────────────────────────────────────────────────────

function SearchSelectField({
  label,
  value,
  options,
  onChange,
  required,
  searchLabel,
  noMatchesText,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
  searchLabel: string;
  noMatchesText: (query: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, options]);

  // Reset highlight + scroll when filter changes
  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      // Focus the search box as soon as the popover opens
      setTimeout(() => searchRef.current?.focus(), 20);
    }
  }, [open]);

  const floated = open || value.length > 0;

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className={fieldShellCls(open)}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 bg-transparent px-4 pt-[22px] pb-3 text-left text-[15px] outline-none"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span
            className={`truncate ${value ? "text-white" : "text-transparent"}`}
          >
            {value || "—"}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-white/55"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>
        <span className={floatingLabelCls(floated)}>{label}</span>
        {required && (
          <input
            // Hidden input so native form validation still triggers on the field
            tabIndex={-1}
            aria-hidden
            required
            value={value}
            onChange={() => {}}
            className="pointer-events-none absolute left-4 top-8 h-0 w-0 opacity-0"
          />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
              <Search size={14} className="text-white/50" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlight((h) => Math.min(h + 1, filtered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlight((h) => Math.max(h - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (filtered[highlight]) pick(filtered[highlight]);
                  }
                }}
                placeholder={searchLabel}
                className="w-full bg-transparent text-sm text-white placeholder-white/35 outline-none"
              />
            </div>

            <ul
              ref={listRef}
              role="listbox"
              className="max-h-64 overflow-y-auto p-1.5 custom-scroll"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-5 text-center text-sm text-white/50">
                  {noMatchesText(query)}
                </li>
              ) : (
                filtered.map((o, i) => {
                  const isActive = o === value;
                  const isHi = i === highlight;
                  return (
                    <li key={o}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlight(i)}
                        onClick={() => pick(o)}
                        className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2 text-sm transition ${
                          isActive
                            ? "bg-gradient-to-r from-magenta-500/20 to-royal-500/20 text-white"
                            : isHi
                              ? "bg-white/[0.06] text-white"
                              : "text-white/75 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{o}</span>
                        {isActive && (
                          <Check size={14} className="text-magenta-300" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main section
// ──────────────────────────────────────────────────────────────────────────

export default function GetAQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [state, setState] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const t = useT();

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
        setStatus("idle");
      }, 2800);
    }, 1400);
  };

  const shipmentOptions: SelectOption[] = [
    { value: "Sea", label: t("contact.form.shipment.sea") },
    { value: "Air", label: t("contact.form.shipment.air") },
    { value: "Land", label: t("contact.form.shipment.land") },
    { value: "Customs", label: t("contact.form.shipment.customs") },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-32"
    >
      <SceneCanvas cameraPos={[0, 2.5, 6]} fov={42} className="opacity-[0.35]">
        <CompassScene />
      </SceneCanvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#05060D_88%)]" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
            {t("contact.eyebrow")}
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {t("contact.title.part1")}{" "}
            <span className="gradient-text">{t("contact.title.highlight")}</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
            {t("contact.intro")}
          </p>

          <div className="mt-10 space-y-5 text-sm">
            <a
              href="mailto:info@reynoldsegypt.com"
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-magenta-500/10 text-magenta-300">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {t("contact.email.label")}
                </div>
                <div className="text-white">info@reynoldsegypt.com</div>
              </div>
            </a>
            <a
              href="tel:+20034838515"
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-royal-500/10 text-royal-300">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {t("contact.phone.label")}
                </div>
                <div className="text-white">03-4838515</div>
              </div>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {t("contact.office.label")}
                </div>
                <div className="text-white">{t("contact.office.address")}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-6 backdrop-blur-sm sm:p-10"
        >
          <div className="noise" />
          <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field
              label={t("contact.form.fullName")}
              name="fullName"
              required
              value={state.fullName}
              onChange={update}
            />
            <Field
              label={t("contact.form.company")}
              name="company"
              value={state.company}
              onChange={update}
            />
            <Field
              label={t("contact.form.email")}
              name="email"
              type="email"
              required
              value={state.email}
              onChange={update}
            />
            <Field
              label={t("contact.form.phone")}
              name="phone"
              type="tel"
              value={state.phone}
              onChange={update}
            />
            <SelectField
              label={t("contact.form.shipmentType")}
              value={state.shipmentType}
              options={shipmentOptions}
              onChange={(v) => update("shipmentType", v)}
            />
            <div className="hidden sm:block" />
            <SearchSelectField
              label={t("contact.form.origin")}
              value={state.origin}
              options={COUNTRIES}
              onChange={(v) => update("origin", v)}
              required
              searchLabel={`${t("contact.form.searchPrefix")} ${t(
                "contact.form.origin"
              ).replace(" *", "")}…`}
              noMatchesText={(q) => t("contact.form.noMatches", { query: q })}
            />
            <SearchSelectField
              label={t("contact.form.destination")}
              value={state.destination}
              options={PORT_CITIES}
              onChange={(v) => update("destination", v)}
              required
              searchLabel={`${t("contact.form.searchPrefix")} ${t(
                "contact.form.destination"
              ).replace(" *", "")}…`}
              noMatchesText={(q) => t("contact.form.noMatches", { query: q })}
            />
            <div className="sm:col-span-2">
              <Field
                label={t("contact.form.message")}
                name="message"
                as="textarea"
                value={state.message}
                onChange={update}
              />
            </div>

            <div className="mt-4 flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/40">
                {t("contact.form.footnote")}
              </p>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={status !== "idle"}
                className="relative inline-flex h-14 min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-8 text-base font-medium text-white shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)] disabled:opacity-80"
              >
                <AnimatePresence mode="wait">
                  {status === "idle" && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      {t("contact.form.send")}{" "}
                      <span data-mirror-on-rtl>→</span>
                    </motion.span>
                  )}
                  {status === "loading" && (
                    <motion.span
                      key="load"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Loader2 className="animate-spin" size={18} />
                      {t("contact.form.sending")}
                    </motion.span>
                  )}
                  {status === "done" && (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check size={18} /> {t("contact.form.sent")}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
