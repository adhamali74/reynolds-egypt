import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { resolveTranslation, TRANSLATIONS, type Lang } from "./translations";

const STORAGE_KEY = "reynolds.lang";

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Translate a key. Optional params replace {placeholder} tokens in the string. */
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

function readInitial(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "en" || saved === "ar") return saved;
  } catch {
    /* localStorage unavailable — fall through */
  }
  return "en";
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = params[k];
    return v === undefined ? `{${k}}` : String(v);
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  // Sync <html lang> + <html dir> whenever lang changes. Also persist.
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* noop */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((l) => (l === "ar" ? "en" : "ar")),
    []
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      interpolate(resolveTranslation(lang, key), params),
    [lang]
  );

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback — no provider mounted. Return a no-op so components don't crash
    // during early boot (e.g. ErrorBoundary fallback trees).
    return {
      lang: "en",
      dir: "ltr",
      setLang: () => {},
      toggleLang: () => {},
      t: (key, params) => interpolate(TRANSLATIONS.en[key] ?? key, params),
    };
  }
  return ctx;
}

/** Convenience hook — returns just the translate function. */
export function useT() {
  return useLanguage().t;
}
