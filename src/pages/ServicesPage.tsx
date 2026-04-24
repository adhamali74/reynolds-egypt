import Services from "../components/Services";
import SectionDivider from "../components/SectionDivider";
import ErrorBoundary from "../components/ErrorBoundary";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

export default function ServicesPage() {
  const t = useT();
  return (
    <main className="relative pt-20">
      <div className="relative z-20 mx-auto max-w-7xl px-6 pt-8 sm:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={14} /> {t("common.backToHome")}
        </Link>
      </div>
      <ErrorBoundary fallback={null}>
        <Services />
      </ErrorBoundary>
      <SectionDivider />
      <section className="relative bg-ink-950 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-center sm:px-10">
          <p className="text-sm uppercase tracking-[0.25em] text-white/50">
            {t("common.readyToMove")}
          </p>
          <h3 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {t("services.cta.line")}
          </h3>
          <Link
            to="/contact"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-magenta-500 to-royal-500 px-7 py-3.5 text-sm font-medium text-white shadow-[0_20px_60px_-10px_rgba(230,1,122,0.5)]"
          >
            {t("services.cta.button")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <SectionDivider />
    </main>
  );
}
