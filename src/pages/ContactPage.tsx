import GetAQuote from "../components/GetAQuote";
import LocationMap from "../components/LocationMap";
import GoogleReviews from "../components/GoogleReviews";
import SectionDivider from "../components/SectionDivider";
import ErrorBoundary from "../components/ErrorBoundary";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

export default function ContactPage() {
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
        <GetAQuote />
      </ErrorBoundary>
      <SectionDivider />
      <ErrorBoundary fallback={null}>
        <LocationMap />
      </ErrorBoundary>
      <SectionDivider />
      <ErrorBoundary fallback={null}>
        <GoogleReviews />
      </ErrorBoundary>
      <SectionDivider />
    </main>
  );
}
