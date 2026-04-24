import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Navigation, ArrowUpRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useT } from "../i18n/LanguageContext";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Reynolds+Egypt+Alexandria&destination_place_id=6+Talaat+Harb+St+Al+Attarin+Alexandria+Egypt";

// 6 Talaat Harb St., 3rd Floor, Al Attarin, Alexandria — Reynolds Egypt office.
// Coordinates sourced from OpenStreetMap Nominatim geocoder for the exact
// street number (6 شارع طلعت حرب, الإسكندرية, 21521) — matches the building
// that hosts the Reynolds Egypt listing on Google Maps.
const COORDS: [number, number] = [31.1962124, 29.9003568];

// Custom pink SVG marker (magenta gradient to match the theme).
// Using a divIcon so we can inline the SVG + halo without shipping a PNG.
const pinIcon = L.divIcon({
  html: `
    <div class="reynolds-pin">
      <span class="reynolds-pin__pulse"></span>
      <svg viewBox="0 0 32 44" width="32" height="44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="pinGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#FF3FA1"/>
            <stop offset="100%" stop-color="#5E72FA"/>
          </linearGradient>
        </defs>
        <path d="M16 0C7.16 0 0 7.16 0 16c0 11 16 28 16 28s16-17 16-28C32 7.16 24.84 0 16 0z" fill="url(#pinGrad)"/>
        <circle cx="16" cy="16" r="6" fill="#fff"/>
      </svg>
    </div>
  `,
  className: "reynolds-pin-wrap",
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -40],
});

export default function LocationMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const t = useT();
  const address = `${t("footer.address.line1")} ${t("footer.address.line2")}`;

  return (
    <section
      id="find-us"
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-24"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-magenta-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-royal-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta-500" />
            {t("location.eyebrow")}
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {t("location.title.part1")}{" "}
            <span className="gradient-text">{t("location.title.highlight")}</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            {t("location.intro")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="reynolds-map-container relative h-[300px] w-full sm:h-[400px]">
            <MapContainer
              center={COORDS}
              zoom={18}
              scrollWheelZoom={false}
              attributionControl={false}
              className="h-full w-full"
            >
              {/* CARTO Dark Matter — free, dark-themed tiles, no API key */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains={["a", "b", "c", "d"]}
                maxZoom={19}
              />
              <Marker position={COORDS} icon={pinIcon}>
                <Popup>
                  <strong>{t("location.popup.name")}</strong>
                  <br />
                  {address}
                </Popup>
              </Marker>
            </MapContainer>

            {/* Soft inner vignette to blend the map into the theme */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,6,13,0.55)_100%)]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-3 text-sm text-white/70">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-magenta-500/10 text-magenta-300">
              <MapPin size={16} />
            </span>
            <span>{address}</span>
          </div>

          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-6 py-3 text-sm font-medium text-white shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)] transition hover:shadow-[0_20px_60px_-10px_rgba(230,1,122,0.75)]"
          >
            <Navigation size={16} />
            {t("location.cta")}
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
