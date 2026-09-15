"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import idMessages from "../messages/id.json";
import enMessages from "../messages/en.json";

const messagesByLocale = { id: idMessages, en: enMessages };
const SUPPORTED_LOCALES = ["id", "en"];

const LocaleContext = createContext(null);

export function ZenLocaleProvider({ initialLocale = "id", initialMessages, children }) {
  const safeInitialLocale = SUPPORTED_LOCALES.includes(initialLocale) ? initialLocale : "id";
  const [locale, setLocaleState] = useState(safeInitialLocale);
  // The server-provided initialLocale is only a fallback. On a provider
  // remount, restore the user's last explicit client preference instead of
  // silently reverting to the server/default locale. This effect runs once
  // per provider mount and never follows initialLocale, so navigation or
  // prop changes cannot overwrite an explicit language choice.
  useEffect(() => {
    const restorePersistedLocale = () => {
      try {
        const localStorageLocale = window.localStorage.getItem("zenai_locale");
        const cookieLocale = document.cookie
          .split(";")
          .map((part) => part.trim())
          .find((part) => part.startsWith("NEXT_LOCALE="))
          ?.split("=")[1];
        const pendingLocale = window.sessionStorage.getItem("zenai_pending_locale_sync");
        const persistedLocale = [localStorageLocale, cookieLocale, pendingLocale]
          .find((candidate) => SUPPORTED_LOCALES.includes(candidate));

        if (persistedLocale && persistedLocale !== locale) {
          setLocaleState(persistedLocale);
        }
      } catch {}
    };

    // Restore once on mount and when a browser restores/resumes the page.
    // User-selected locale remains authoritative; these listeners only recover
    // the already-persisted choice and never select a new language themselves.
    restorePersistedLocale();
    window.addEventListener("pageshow", restorePersistedLocale);
    window.addEventListener("focus", restorePersistedLocale);
    document.addEventListener("visibilitychange", restorePersistedLocale);

    return () => {
      window.removeEventListener("pageshow", restorePersistedLocale);
      window.removeEventListener("focus", restorePersistedLocale);
      document.removeEventListener("visibilitychange", restorePersistedLocale);
    };
    // locale is intentionally omitted: restoration must not continuously
    // re-apply persisted state after every locale render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((nextLocale) => {
    if (!SUPPORTED_LOCALES.includes(nextLocale)) return;
    setLocaleState((current) => (current === nextLocale ? current : nextLocale));
    try {
      document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
      window.localStorage.setItem("zenai_locale", nextLocale);
      window.sessionStorage.setItem("zenai_pending_locale_sync", nextLocale);
    } catch {}
  }, []);

  useEffect(() => {
    // Keep the server-rendered <html lang> and browser language state aligned
    // after a client-side locale change, without a full page reload.
    document.documentElement.lang = locale;
  }, [locale]);

  const messages = messagesByLocale[locale] || initialMessages || idMessages;
  const value = useMemo(() => ({ locale, setLocale, supportedLocales: SUPPORTED_LOCALES }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useZenLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useZenLocale must be used inside ZenLocaleProvider");
  return value;
}
