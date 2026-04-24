import Hero from "../components/Hero";
import WorldMap from "../components/WorldMap";
import CEOQuote from "../components/CEOQuote";
import Instagram from "../components/Instagram";
import ExploreNav from "../components/ExploreNav";
import SectionDivider from "../components/SectionDivider";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Home() {
  return (
    <main className="relative">
      <ErrorBoundary fallback={null}>
        <Hero />
      </ErrorBoundary>
      <SectionDivider />
      <ErrorBoundary fallback={null}>
        <ExploreNav />
      </ErrorBoundary>
      <SectionDivider />
      <ErrorBoundary fallback={null}>
        <CEOQuote />
      </ErrorBoundary>
      <SectionDivider />
      <ErrorBoundary fallback={null}>
        <WorldMap />
      </ErrorBoundary>
      <SectionDivider />
      <ErrorBoundary fallback={null}>
        <Instagram />
      </ErrorBoundary>
      <SectionDivider />
    </main>
  );
}
