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
