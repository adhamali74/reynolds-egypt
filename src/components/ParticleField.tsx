import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared particle-network canvas.
// Pure 2-D, no Three.js — lightweight and distinct from the 3-D scenes.
//
// Props:
//   isLight      — swap palette & alpha for the light theme
//   radiusScale  — multiply base dot radius (default 1). Use > 1 for bigger dots.
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

export default function ParticleField({
  isLight,
  radiusScale = 1,
}: {
  isLight: boolean;
  radiusScale?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;

    type P = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; col: string; a: number;
    };
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
          // base radius 0.9–2.7, scaled by radiusScale prop
          r:  (Math.random() * 1.8 + 0.9) * radiusScale,
          col,
          a:  isLight
            ? Math.random() * 0.35 + 0.45   // 0.45–0.80 on light bg
            : Math.random() * 0.40 + 0.55,  // 0.55–0.95 on dark bg
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
  }, [isLight, radiusScale]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
