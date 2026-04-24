import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotButton from "./components/ChatbotButton";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContactPage from "./pages/ContactPage";
import { useLenis } from "./hooks/useLenis";

export default function App() {
  useLenis();

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-ink-950 text-white p-10">
          <h1 className="text-2xl font-display">Reynolds Egypt</h1>
          <p className="mt-2 text-white/60">
            Something rendered unexpectedly. Reload the page to try again.
          </p>
        </div>
      }
    >
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <ErrorBoundary fallback={null}>
        <Footer />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <ChatbotButton />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
