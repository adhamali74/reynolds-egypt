import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    // Handle in-page anchor clicks
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -40 });
    };
    document.addEventListener("click", onClick);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const scrollParam = new URLSearchParams(location.search).get("scrollTo");
    if (scrollParam) {
      const y = parseInt(scrollParam, 10);
      if (!Number.isNaN(y)) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            lenis.scrollTo(y, { immediate: true, force: true });
          });
        });
      }
    } else if (location.hash && location.hash !== "#") {
      const el = document.querySelector(location.hash);
      if (el) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            lenis.scrollTo(el as HTMLElement, { immediate: true, offset: -40 });
          });
        });
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);
}
