import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import { Plus, Minus, Maximize2, Hand } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { type Map as LeafletMap, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useT } from "../i18n/LanguageContext";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type Priority = 1 | 2 | 3;

type Port = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  egy?: boolean;
  /** 1 = top hub / always shown, 2 = medium, 3 = minor */
  p: Priority;
};

type RoutePair = [string, string];

// ──────────────────────────────────────────────────────────────────────────
// Ports
// ──────────────────────────────────────────────────────────────────────────

const PORTS: Port[] = [
  // ── Egypt (all magenta, all priority 1) ───────────────────────────────
  { id: "alexandria",     name: "Alexandria",     country: "Egypt", lat: 31.20, lng: 29.92, egy: true, p: 1 },
  { id: "el-dekheila",    name: "El Dekheila",    country: "Egypt", lat: 31.16, lng: 29.83, egy: true, p: 1 },
  { id: "damietta",       name: "Damietta",       country: "Egypt", lat: 31.42, lng: 31.81, egy: true, p: 1 },
  { id: "port-said",      name: "Port Said",      country: "Egypt", lat: 31.26, lng: 32.30, egy: true, p: 1 },
  { id: "east-port-said", name: "East Port Said", country: "Egypt", lat: 31.27, lng: 32.37, egy: true, p: 1 },
  { id: "suez",           name: "Suez",           country: "Egypt", lat: 29.97, lng: 32.55, egy: true, p: 1 },
  { id: "adabiya",        name: "Adabiya",        country: "Egypt", lat: 29.87, lng: 32.55, egy: true, p: 1 },
  { id: "ain-sokhna",     name: "Ain Sokhna",     country: "Egypt", lat: 29.60, lng: 32.33, egy: true, p: 1 },
  { id: "safaga",         name: "Safaga",         country: "Egypt", lat: 26.68, lng: 33.94, egy: true, p: 1 },

  // ── Top-10 global hubs (priority 1) ───────────────────────────────────
  { id: "rotterdam",      name: "Rotterdam",      country: "Netherlands",   lat: 51.90, lng:   4.50, p: 1 },
  { id: "shanghai",       name: "Shanghai",       country: "China",         lat: 31.36, lng: 121.59, p: 1 },
  { id: "singapore",      name: "Singapore",      country: "Singapore",     lat:  1.26, lng: 103.82, p: 1 },
  { id: "ningbo",         name: "Ningbo-Zhoushan",country: "China",         lat: 29.95, lng: 121.97, p: 1 },
  { id: "busan",          name: "Busan",          country: "South Korea",   lat: 35.08, lng: 129.04, p: 1 },
  { id: "jebel-ali",      name: "Jebel Ali",      country: "UAE",           lat: 25.01, lng:  55.06, p: 1 },
  { id: "antwerp",        name: "Antwerp",        country: "Belgium",       lat: 51.27, lng:   4.39, p: 1 },
  { id: "hamburg",        name: "Hamburg",        country: "Germany",       lat: 53.53, lng:   9.97, p: 1 },
  { id: "piraeus",        name: "Piraeus",        country: "Greece",        lat: 37.94, lng:  23.64, p: 1 },
  { id: "valencia",       name: "Valencia",       country: "Spain",         lat: 39.45, lng:  -0.32, p: 1 },

  // ── Medium hubs (priority 2) ──────────────────────────────────────────
  { id: "bremerhaven",    name: "Bremerhaven",    country: "Germany",       lat: 53.54, lng:   8.58, p: 2 },
  { id: "felixstowe",     name: "Felixstowe",     country: "UK",            lat: 51.96, lng:   1.30, p: 2 },
  { id: "amsterdam",      name: "Amsterdam",      country: "Netherlands",   lat: 52.41, lng:   4.78, p: 2 },
  { id: "istanbul",       name: "Ambarli",        country: "Turkey",        lat: 40.96, lng:  28.69, p: 2 },
  { id: "barcelona",      name: "Barcelona",      country: "Spain",         lat: 41.35, lng:   2.17, p: 2 },
  { id: "genoa",          name: "Genoa",          country: "Italy",         lat: 44.41, lng:   8.93, p: 2 },
  { id: "algeciras",      name: "Algeciras",      country: "Spain",         lat: 36.13, lng:  -5.44, p: 2 },
  { id: "malta",          name: "Marsaxlokk",     country: "Malta",         lat: 35.83, lng:  14.54, p: 2 },
  { id: "le-havre",       name: "Le Havre",       country: "France",        lat: 49.48, lng:   0.11, p: 2 },
  { id: "marseille",      name: "Marseille / Fos",country: "France",        lat: 43.39, lng:   4.87, p: 2 },
  { id: "mundra",         name: "Mundra",         country: "India",         lat: 22.74, lng:  69.72, p: 2 },
  { id: "nhava-sheva",    name: "Nhava Sheva",    country: "India",         lat: 18.95, lng:  72.95, p: 2 },
  { id: "colombo",        name: "Colombo",        country: "Sri Lanka",     lat:  6.95, lng:  79.85, p: 2 },
  { id: "port-klang",     name: "Port Klang",     country: "Malaysia",      lat:  2.99, lng: 101.39, p: 2 },
  { id: "jeddah",         name: "Jeddah",         country: "Saudi Arabia",  lat: 21.49, lng:  39.17, p: 2 },
  { id: "salalah",        name: "Salalah",        country: "Oman",          lat: 16.94, lng:  54.00, p: 2 },

  // ── Minor / regional (priority 3) ─────────────────────────────────────
  { id: "gothenburg",     name: "Gothenburg",     country: "Sweden",        lat: 57.70, lng:  11.94, p: 3 },
  { id: "gioia-tauro",    name: "Gioia Tauro",    country: "Italy",         lat: 38.43, lng:  15.89, p: 3 },
  { id: "southampton",    name: "Southampton",    country: "UK",            lat: 50.89, lng:  -1.40, p: 3 },
  { id: "gdansk",         name: "Gdansk",         country: "Poland",        lat: 54.40, lng:  18.67, p: 3 },
  { id: "constanta",      name: "Constanta",      country: "Romania",       lat: 44.17, lng:  28.66, p: 3 },
  { id: "king-abdullah",  name: "King Abdullah",  country: "Saudi Arabia",  lat: 22.82, lng:  38.99, p: 3 },
  { id: "djibouti",       name: "Djibouti",       country: "Djibouti",      lat: 11.60, lng:  43.15, p: 3 },
];

const PORT_BY_ID: Record<string, Port> = Object.fromEntries(PORTS.map((p) => [p.id, p]));

// ──────────────────────────────────────────────────────────────────────────
// Shipping routes
// ──────────────────────────────────────────────────────────────────────────

const ROUTES: RoutePair[] = [
  // Egypt → Europe (Mediterranean)
  ["alexandria", "piraeus"],
  ["alexandria", "valencia"],
  ["alexandria", "barcelona"],
  ["alexandria", "genoa"],
  ["alexandria", "marseille"],
  ["alexandria", "felixstowe"],
  ["alexandria", "rotterdam"],
  ["el-dekheila", "algeciras"],
  ["damietta", "antwerp"],
  ["damietta", "hamburg"],
  ["damietta", "bremerhaven"],
  ["damietta", "amsterdam"],
  ["damietta", "gothenburg"],
  ["damietta", "gdansk"],
  ["port-said", "istanbul"],
  ["port-said", "piraeus"],
  ["port-said", "malta"],
  ["port-said", "le-havre"],
  ["port-said", "southampton"],
  ["port-said", "constanta"],
  ["east-port-said", "gioia-tauro"],
  ["east-port-said", "algeciras"],

  // Egypt → Asia / Middle East / Gulf (via Red Sea + Suez)
  ["port-said", "shanghai"],
  ["port-said", "ningbo"],
  ["port-said", "singapore"],
  ["port-said", "busan"],
  ["port-said", "port-klang"],
  ["ain-sokhna", "jebel-ali"],
  ["ain-sokhna", "jeddah"],
  ["ain-sokhna", "mundra"],
  ["ain-sokhna", "nhava-sheva"],
  ["suez", "salalah"],
  ["suez", "colombo"],
  ["adabiya", "djibouti"],
  ["safaga", "salalah"],
  ["safaga", "king-abdullah"],

  // Non-Egyptian inter-hub (blue lines)
  ["rotterdam", "shanghai"],
  ["rotterdam", "singapore"],
  ["rotterdam", "hamburg"],
  ["rotterdam", "antwerp"],
  ["antwerp", "felixstowe"],
  ["valencia", "algeciras"],
  ["piraeus", "gioia-tauro"],
  ["singapore", "shanghai"],
  ["singapore", "jebel-ali"],
  ["colombo", "singapore"],
  ["nhava-sheva", "jebel-ali"],
  ["busan", "shanghai"],
  ["ningbo", "busan"],
];

// ──────────────────────────────────────────────────────────────────────────
// Quadratic bezier curve between two ports, sampled for Leaflet polyline
// ──────────────────────────────────────────────────────────────────────────

function curvePoints(from: Port, to: Port, steps = 48): LatLngExpression[] {
  const mLat = (from.lat + to.lat) / 2;
  const mLng = (from.lng + to.lng) / 2;
  const dLat = to.lat - from.lat;
  const dLng = to.lng - from.lng;
  const dist = Math.hypot(dLat, dLng) || 0.0001;
  // Unit perpendicular (normal to the line)
  const nLat = -dLng / dist;
  const nLng = dLat / dist;
  // Curvature: 15% of span, capped so short lanes don't look silly
  const offset = Math.min(dist * 0.16, 14);
  // Arc away from the equator for a natural shipping-lane feel
  const sign = mLat >= 0 ? 1 : -1;
  const ctrlLat = mLat + nLat * offset * sign;
  const ctrlLng = mLng + nLng * offset * sign;

  const pts: LatLngExpression[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([
      u * u * from.lat + 2 * u * t * ctrlLat + t * t * to.lat,
      u * u * from.lng + 2 * u * t * ctrlLng + t * t * to.lng,
    ]);
  }
  return pts;
}

// ──────────────────────────────────────────────────────────────────────────
// Injected styles for port DivIcons + labels
// ──────────────────────────────────────────────────────────────────────────

const MAP_STYLES = `
.reynolds-map .leaflet-container { background:#0f1729; font-family: inherit; outline: none; }
.reynolds-map .leaflet-control-attribution {
  background: rgba(10,14,30,0.55); backdrop-filter: blur(6px);
  color: rgba(255,255,255,0.45); font-size: 10px; border-radius: 6px 0 0 0;
  padding: 3px 8px;
}
.reynolds-map .leaflet-control-attribution a { color: rgba(255,255,255,0.6); }

/* Port dot base */
.port-dot { position: relative; width: 40px; height: 40px; pointer-events: auto; cursor: pointer; }
.port-dot .core, .port-dot .halo {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  border-radius: 9999px; transition: transform 200ms ease, box-shadow 200ms ease;
  pointer-events: none;
}

/* Egyptian ports: magenta, larger, pulse */
.port-dot.egy .core {
  width: 14px; height: 14px; background: #FF1493;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.18), 0 0 14px rgba(255,20,147,0.85);
}
.port-dot.egy .halo {
  width: 38px; height: 38px;
  background: radial-gradient(circle, rgba(255,20,147,0.45) 0%, rgba(255,20,147,0) 70%);
  animation: reynolds-pulse 2.6s ease-in-out infinite;
}

/* Other ports: blue, smaller, subtle glow */
.port-dot.other .core {
  width: 9px; height: 9px; background: #3B82F6;
  box-shadow: 0 0 0 1.5px rgba(255,255,255,0.14), 0 0 10px rgba(59,130,246,0.7);
}
.port-dot.other .halo {
  width: 22px; height: 22px;
  background: radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 70%);
}

/* Highlighted / hovered states */
.port-dot.egy.active .core   { transform: translate(-50%,-50%) scale(1.35); }
.port-dot.other.active .core { transform: translate(-50%,-50%) scale(1.5); box-shadow: 0 0 0 2px rgba(255,255,255,0.28), 0 0 14px rgba(96,165,250,0.95); }

@keyframes reynolds-pulse {
  0%,100% { transform: translate(-50%,-50%) scale(0.7); opacity: 0.9; }
  50%     { transform: translate(-50%,-50%) scale(1.3); opacity: 0.15; }
}

/* Labels overlay — positions are applied via inline transform, never animated,
   so they stay perfectly glued to the map during pan/zoom */
.reynolds-labels {
  position: absolute; inset: 0; pointer-events: none; z-index: 650;
  will-change: transform;
}
.reynolds-labels .lbl {
  position: absolute; top: 0; left: 0; white-space: nowrap;
  color: #fff; font-weight: 500; letter-spacing: 0.01em;
  text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7);
  will-change: transform;
  /* No transitions / animations — labels must snap 1:1 with the map frame */
  transition: none !important;
  animation: none !important;
}
.reynolds-labels .lbl.egy { font-weight: 700; color: #fff; }
.reynolds-labels .lbl.p1  { font-weight: 600; }
.reynolds-labels .lbl.dimmed { opacity: 0.45; }

/* Tooltip for hover/click */
.reynolds-tooltip {
  position: absolute; top: 0; left: 0; pointer-events: none; z-index: 800;
  padding: 10px 14px; border-radius: 12px;
  background: rgba(10,14,30,0.92); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-size: 12px; line-height: 1.4;
  box-shadow: 0 14px 40px -10px rgba(0,0,0,0.6);
  min-width: 140px;
  will-change: transform;
  transition: none !important;
}
.reynolds-tooltip .name { font-weight: 600; font-size: 13px; }
.reynolds-tooltip .country { color: rgba(255,255,255,0.6); font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px; }
.reynolds-tooltip .meta { margin-top: 6px; color: rgba(255,255,255,0.7); }
.reynolds-tooltip .meta .num { color: #FF1493; font-weight: 700; }
`;

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.id = "reynolds-map-styles";
  el.textContent = MAP_STYLES;
  document.head.appendChild(el);
  stylesInjected = true;
}

// ──────────────────────────────────────────────────────────────────────────
// DivIcon factory for port dots
// ──────────────────────────────────────────────────────────────────────────

function portIcon(port: Port, active: boolean): L.DivIcon {
  return L.divIcon({
    className: "", // avoid leaflet default class
    html: `<div class="port-dot ${port.egy ? "egy" : "other"}${active ? " active" : ""}"><span class="halo"></span><span class="core"></span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    tooltipAnchor: [0, -10],
  });
}

// ──────────────────────────────────────────────────────────────────────────
// Routes layer — renders all bezier curves, with dimmed/bright visual states
// ──────────────────────────────────────────────────────────────────────────

type RoutesLayerProps = {
  routes: RoutePair[];
  selected: string | null;
  hovered: string | null;
  setHoveredRoute: (idx: number | null) => void;
  hoveredRoute: number | null;
};

function RoutesLayer({ routes, selected, hovered, setHoveredRoute, hoveredRoute }: RoutesLayerProps) {
  const paths = useMemo(
    () =>
      routes.map(([a, b]) => {
        const from = PORT_BY_ID[a];
        const to = PORT_BY_ID[b];
        const egy = !!(from?.egy || to?.egy);
        const pts = from && to ? curvePoints(from, to) : [];
        return { a, b, egy, pts };
      }),
    [routes]
  );

  return (
    <>
      {paths.map((r, i) => {
        const focusPort = selected ?? hovered;
        const isFocus =
          hoveredRoute === i ||
          (!!focusPort && (r.a === focusPort || r.b === focusPort));

        const baseOpacity = r.egy ? 0.3 : 0.2;
        const opacity = isFocus ? 0.95 : baseOpacity;
        const color = r.egy ? "#E6017A" : "#3B82F6";
        const weight = isFocus ? 2.4 : r.egy ? 1.4 : 1.1;

        return (
          <Polyline
            key={`${r.a}-${r.b}`}
            positions={r.pts}
            pathOptions={{
              color,
              opacity,
              weight,
              lineCap: "round",
              lineJoin: "round",
              // subtle dashed feel on non-egy background routes
              dashArray: r.egy ? undefined : isFocus ? undefined : "4 5",
            }}
            eventHandlers={{
              mouseover: () => setHoveredRoute(i),
              mouseout: () => setHoveredRoute(null),
            }}
          />
        );
      })}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Port markers layer
// ──────────────────────────────────────────────────────────────────────────

type PortsLayerProps = {
  ports: Port[];
  selected: string | null;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
};

function PortsLayer({ ports, selected, hovered, onHover, onSelect }: PortsLayerProps) {
  return (
    <>
      {ports.map((p) => {
        const active = selected === p.id || hovered === p.id;
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={portIcon(p, active)}
            // Egyptian ports render above blue ports
            zIndexOffset={p.egy ? 1000 : 0}
            eventHandlers={{
              mouseover: () => onHover(p.id),
              mouseout: () => onHover(null),
              click: () => onSelect(selected === p.id ? null : p.id),
            }}
          />
        );
      })}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Labels + tooltip overlay (portal into map container)
//
// Labels are rendered once per "placement epoch" (zoomend / moveend / resize
// and when the focus / port list changes). Their screen positions are NOT
// stored in React state. Instead, each label's DOM node is addressed via a
// ref and its `transform: translate3d(x, y, 0)` is written directly inside
// Leaflet's `move` event handler — which fires on every animation frame
// during drag and zoom. That makes the labels move in perfect sync with the
// tile layer (no React batching latency, no CSS transitions, no repaint lag).
// ──────────────────────────────────────────────────────────────────────────

type Placement = {
  port: Port;
  dx: number; // offset from port screen point, chosen by collision at placement time
  dy: number;
  fs: number;
};

type OverlayProps = {
  ports: Port[];
  hovered: string | null;
  selected: string | null;
  routeCount: Record<string, number>;
};

function MapOverlay({ ports, hovered, selected, routeCount }: OverlayProps) {
  const map = useMap();
  const t = useT();

  // --- overlay root div (portal target, lives inside the map container) ---
  const overlayRef = useRef<HTMLDivElement | null>(null);
  if (overlayRef.current === null && typeof document !== "undefined") {
    const div = document.createElement("div");
    div.className = "reynolds-labels";
    overlayRef.current = div;
  }

  useEffect(() => {
    const container = map.getContainer();
    const overlay = overlayRef.current;
    if (!container || !overlay) return;
    container.appendChild(overlay);
    return () => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }, [map]);

  // --- placements are React state, but only recomputed when visible-label
  //     set could change: zoom / pan finished / focus changed / ports list changed.
  const [placements, setPlacements] = useState<Placement[]>([]);

  const computePlacements = useCallback((): Placement[] => {
    const z = map.getZoom();
    const maxPriority: Priority = z >= 5 ? 3 : z >= 4 ? 2 : 1;
    const fs = Math.max(10, Math.min(14, 7 + z * 0.9));
    const h = fs + 4;

    const focusId = selected ?? hovered;
    const candidates = [...ports]
      .filter((p) => p.p <= maxPriority || p.id === focusId)
      .sort((a, b) => {
        if (a.id === focusId) return -1;
        if (b.id === focusId) return 1;
        if (a.p !== b.p) return a.p - b.p;
        if (!!b.egy !== !!a.egy) return a.egy ? -1 : 1;
        return a.name.length - b.name.length;
      });

    const placed: Array<{ x: number; y: number; w: number; h: number }> = [];
    const out: Placement[] = [];

    for (const p of candidates) {
      const pt = map.latLngToContainerPoint([p.lat, p.lng]);
      const w = p.name.length * fs * 0.58 + 10;
      // Candidate anchor offsets: right, left, top, bottom, tr, tl, br, bl
      const offsets: Array<{ x: number; y: number }> = [
        { x: 10, y: -h / 2 },
        { x: -w - 10, y: -h / 2 },
        { x: -w / 2, y: -h - 14 },
        { x: -w / 2, y: 14 },
        { x: 10, y: -h - 6 },
        { x: -w - 10, y: -h - 6 },
        { x: 10, y: 6 },
        { x: -w - 10, y: 6 },
      ];
      let chosen: { dx: number; dy: number } | null = null;
      for (const off of offsets) {
        const x = pt.x + off.x;
        const y = pt.y + off.y;
        const box = { x, y, w, h };
        const collides = placed.some(
          (b) =>
            !(
              box.x + box.w < b.x ||
              box.x > b.x + b.w ||
              box.y + box.h < b.y ||
              box.y > b.y + b.h
            )
        );
        if (!collides) {
          chosen = { dx: off.x, dy: off.y };
          placed.push(box);
          break;
        }
      }
      if (chosen) {
        out.push({ port: p, dx: chosen.dx, dy: chosen.dy, fs });
      }
    }
    return out;
  }, [map, ports, hovered, selected]);

  // Recompute on zoom end + move end + resize + focus change.
  // NOTE: we recompute ONLY at rest, not during pan — during pan, labels
  // move rigidly with their ports via transform writes (see below).
  useEffect(() => {
    const run = () => setPlacements(computePlacements());
    run();
    map.on("zoomend", run);
    map.on("moveend", run);
    map.on("resize", run);
    return () => {
      map.off("zoomend", run);
      map.off("moveend", run);
      map.off("resize", run);
    };
  }, [map, computePlacements]);

  // --- Refs to each label DOM node so we can write transforms directly ---
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Pre-resolve focus port for the tooltip
  const focusId = hovered ?? selected;
  const focusPort = focusId ? PORT_BY_ID[focusId] ?? null : null;

  // The hot path: on every frame of pan/zoom, write new transforms directly
  // to the DOM. No React state, no CSS transitions — labels move in lockstep
  // with the tile layer.
  useEffect(() => {
    const apply = () => {
      for (const pl of placements) {
        const el = labelRefs.current[pl.port.id];
        if (!el) continue;
        const pt = map.latLngToContainerPoint([pl.port.lat, pl.port.lng]);
        // Round to whole pixels for crispness
        const x = Math.round(pt.x + pl.dx);
        const y = Math.round(pt.y + pl.dy);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      const tip = tooltipRef.current;
      if (tip && focusPort) {
        const pt = map.latLngToContainerPoint([focusPort.lat, focusPort.lng]);
        // Tooltip anchor: centered horizontally, above port
        const tw = tip.offsetWidth;
        const th = tip.offsetHeight;
        const x = Math.round(pt.x - tw / 2);
        const y = Math.round(pt.y - th - 18);
        tip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };
    apply();
    map.on("move", apply);
    map.on("zoom", apply);
    map.on("zoomanim", apply);
    map.on("viewreset", apply);
    return () => {
      map.off("move", apply);
      map.off("zoom", apply);
      map.off("zoomanim", apply);
      map.off("viewreset", apply);
    };
  }, [map, placements, focusPort]);

  if (!overlayRef.current) return null;

  return createPortal(
    <>
      {placements.map(({ port, fs }) => {
        const dim = focusId && focusId !== port.id;
        return (
          <div
            key={port.id}
            ref={(el) => {
              labelRefs.current[port.id] = el;
            }}
            className={`lbl ${port.egy ? "egy" : ""} p${port.p}${
              dim ? " dimmed" : ""
            }`}
            style={{ fontSize: `${fs}px` }}
          >
            {port.name}
          </div>
        );
      })}
      {focusPort && (
        <div ref={tooltipRef} className="reynolds-tooltip">
          <div className="country">{focusPort.country}</div>
          <div className="name">{focusPort.name}</div>
          <div className="meta">
            <span className="num">{routeCount[focusPort.id] ?? 0}</span>{" "}
            {routeCount[focusPort.id] === 1
              ? t("world.tooltip.routes.one")
              : t("world.tooltip.routes.many")}
          </div>
        </div>
      )}
    </>,
    overlayRef.current
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Custom zoom + reset controls (replace Leaflet's default UI)
// ──────────────────────────────────────────────────────────────────────────

type ControlsProps = {
  initialCenter: LatLngExpression;
  initialZoom: number;
};
function CustomControls({ initialCenter, initialZoom }: ControlsProps) {
  const map = useMap();
  const t = useT();
  const button =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/75 transition hover:bg-magenta-500/20 hover:text-white";
  return (
    <div className="absolute right-3 top-3 z-[500] flex flex-col gap-1.5 rounded-xl border border-white/10 bg-ink-950/75 p-1 backdrop-blur-md">
      <button
        type="button"
        aria-label={t("world.zoom.in")}
        onClick={() => map.zoomIn()}
        className={button}
      >
        <Plus size={16} />
      </button>
      <button
        type="button"
        aria-label={t("world.zoom.out")}
        onClick={() => map.zoomOut()}
        className={button}
      >
        <Minus size={16} />
      </button>
      <button
        type="button"
        aria-label={t("world.zoom.reset")}
        onClick={() => map.flyTo(initialCenter, initialZoom, { duration: 0.6 })}
        className={button}
      >
        <Maximize2 size={14} />
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Clears selection when user clicks on empty map area
// ──────────────────────────────────────────────────────────────────────────

function BackgroundClickClear({ onClear }: { onClear: () => void }) {
  useMapEvents({
    click: () => onClear(),
  });
  return null;
}

// ──────────────────────────────────────────────────────────────────────────
// Section — heading, card, map, stats
// ──────────────────────────────────────────────────────────────────────────

export default function WorldMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });
  const mapRef = useRef<LeafletMap | null>(null);
  const t = useT();

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

  const routeCount = useMemo(() => {
    const c: Record<string, number> = {};
    ROUTES.forEach(([a, b]) => {
      c[a] = (c[a] ?? 0) + 1;
      c[b] = (c[b] ?? 0) + 1;
    });
    return c;
  }, []);

  useEffect(() => {
    ensureStyles();
  }, []);

  const initialCenter: LatLngExpression = [28, 32];
  const initialZoom = 3;

  return (
    <section
      id="network"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink-900 py-32"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,63,224,0.08),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-magenta-500" />
            {t("world.eyebrow")}
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {t("world.title.part1")}{" "}
            <span className="gradient-text">{t("world.title.highlight")}</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">
            {t("world.intro")}
          </p>
        </motion.div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800/40 p-4 sm:p-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 text-[10px] uppercase tracking-[0.25em] text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-magenta-500" />
              {t("world.opsLive")}
            </span>
            <span className="text-white/20">|</span>
            <span>{t("world.egyptGlobal")}</span>
            <span className="ml-auto hidden sm:inline">
              {t("world.summary", {
                egyptian: PORTS.filter((p) => p.egy).length,
                total: PORTS.length,
                routes: ROUTES.length,
              })}
            </span>
          </div>

          <div className="relative mt-4">
            <div
              className="reynolds-map relative w-full overflow-hidden rounded-2xl border border-white/5"
              style={{ aspectRatio: "2 / 1", minHeight: 320 }}
            >
              <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                minZoom={2}
                maxZoom={10}
                worldCopyJump
                zoomControl={false}
                attributionControl={true}
                scrollWheelZoom
                // Disable Leaflet's animated zoom so tiles + our labels snap
                // together on the same frame — no visible label drift.
                zoomAnimation={false}
                markerZoomAnimation={false}
                fadeAnimation={false}
                style={{ height: "100%", width: "100%", background: "#0f1729" }}
                ref={(m) => {
                  // react-leaflet v5 forwards the map instance via ref
                  if (m) mapRef.current = m;
                }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                  subdomains={["a", "b", "c", "d"]}
                  maxZoom={19}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <BackgroundClickClear onClear={() => setSelected(null)} />

                <RoutesLayer
                  routes={ROUTES}
                  selected={selected}
                  hovered={hovered}
                  hoveredRoute={hoveredRoute}
                  setHoveredRoute={setHoveredRoute}
                />

                <PortsLayer
                  ports={PORTS}
                  selected={selected}
                  hovered={hovered}
                  onHover={setHovered}
                  onSelect={setSelected}
                />

                <MapOverlay
                  ports={PORTS}
                  hovered={hovered}
                  selected={selected}
                  routeCount={routeCount}
                />

                <CustomControls initialCenter={initialCenter} initialZoom={initialZoom} />
              </MapContainer>
            </div>

            <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/55 backdrop-blur-sm">
              <Hand size={11} />
              {t("world.hint")}
            </div>

            <div className="pointer-events-none absolute bottom-3 right-3 z-[500] hidden items-center gap-3 rounded-full border border-white/10 bg-ink-950/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/55 backdrop-blur-sm sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-magenta-500 shadow-[0_0_10px_rgba(255,20,147,0.8)]" />
                {t("world.legend.egyptian")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-royal-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                {t("world.legend.global")}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/5 pt-6 text-xs text-white/50 sm:grid-cols-4">
            {[
              [t("world.stat.egyptian"), String(PORTS.filter((p) => p.egy).length)],
              [t("world.stat.world"), String(PORTS.filter((p) => !p.egy).length)],
              [t("world.stat.lanes"), String(ROUTES.length)],
              [t("world.stat.ontime"), "98.2%"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {k}
                </div>
                <div className="mt-1 font-display text-xl text-white">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
