import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./routing";

export default getRequestConfig(async () => {
  let locale = routing.defaultLocale;

  // Tanpa middleware (localePrefix: "never"), locale dibaca dari cookie
  // NEXT_LOCALE yang ditulis oleh tombol ganti bahasa. Saat static
  // prerendering (mis. /_not-found) cookies() tidak tersedia, jadi
  // fallback ke defaultLocale.
  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale && routing.locales.includes(cookieLocale)) {
      locale = cookieLocale;
    }
  } catch {
    // static prerender: abaikan, pakai default locale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});