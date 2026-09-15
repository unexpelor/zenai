import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = routing.defaultLocale;

  // With localePrefix: "never", persist the user's explicit choice in NEXT_LOCALE.
  // The cookie takes precedence so reloads/auth screens cannot silently fall back to ID.
  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale && routing.locales.includes(cookieLocale)) {
      locale = cookieLocale;
    } else {
      const requestedLocale = await requestLocale;
      if (requestedLocale && routing.locales.includes(requestedLocale)) {
        locale = requestedLocale;
      }
    }
  } catch {
    const requestedLocale = await requestLocale;
    if (requestedLocale && routing.locales.includes(requestedLocale)) {
      locale = requestedLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
