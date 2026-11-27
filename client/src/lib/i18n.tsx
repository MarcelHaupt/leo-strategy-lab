// Zweisprachigkeit DE/EN.
// Die aktuelle Sprache liegt zusätzlich in einer Modul-Variable, damit Engines und Exporte
// (leo-engine, tiny-engine, export …) ohne Durchreichen eines Parameters übersetzen können.
// Beim Umschalten wird der Seitenbaum unterhalb des Providers neu aufgebaut; die Session bleibt,
// weil sie im SessionProvider oberhalb liegt.
import { createContext, useContext, useEffect, useState, Fragment, type ReactNode } from 'react';

export type Lang = 'de' | 'en';
export type Bi = { de: string; en: string };

const STORAGE_KEY = 'leo-lang';

function detectLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'de' || saved === 'en') return saved;
  } catch {
    // privater Modus o. Ä.: dann eben nach Browser-Sprache
  }
  const nav = typeof navigator !== 'undefined' ? navigator.languages?.[0] || navigator.language || '' : '';
  return nav.toLowerCase().startsWith('de') ? 'de' : 'en';
}

let current: Lang = typeof window !== 'undefined' ? detectLang() : 'de';

export const getLang = (): Lang => current;
/** Für Tests und Server-Rendering */
export const setLangForTests = (l: Lang) => {
  current = l;
};
/** Wählt den Text der aktuellen Sprache */
export const tr = (de: string, en: string): string => (current === 'en' ? en : de);
/** Wie tr, für zweisprachige Objekte */
export const bi = (x: Bi | undefined): string => (x ? (current === 'en' ? x.en : x.de) : '');
/** Locale für Datumsformate */
export const dateLocale = (): string => (current === 'en' ? 'en-GB' : 'de-DE');

/**
 * Legt über ein deutsches Datenobjekt eine englische Fassung: die genannten Felder werden zu Gettern,
 * die je nach aktueller Sprache den deutschen oder englischen Wert liefern. So bleiben alle
 * Verbraucher (Seiten, Engines, Exporte) unverändert.
 */
export function localized<T extends object>(base: T, en: Partial<Record<keyof T, unknown>> | undefined): T {
  if (!en) return base;
  const out = { ...base } as T;
  for (const key of Object.keys(en) as (keyof T)[]) {
    const enVal = en[key];
    if (enVal === undefined) continue;
    const deVal = base[key];
    Object.defineProperty(out, key, {
      get: () => (current === 'en' ? enVal : deVal),
      enumerable: true,
      configurable: true,
    });
  }
  return out;
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: current, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setState] = useState<Lang>(current);

  const setLang = (l: Lang) => {
    current = l;
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // nicht speicherbar: gilt dann nur für diesen Besuch
    }
    setState(l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Fragment key={lang}>{children}</Fragment>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
