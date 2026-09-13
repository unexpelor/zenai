const PREFIX = "zenai_i18n_ai";

export function createLocalizationCacheKey({ userId, sourceHash, locale, key }) {
  return `${PREFIX}_${userId || "anonymous"}_${sourceHash}_${locale}_${key}`;
}

export function readLocalizationCache(cacheKey) {
  try {
    const raw = sessionStorage.getItem(cacheKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeLocalizationCache(cacheKey, value) {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(value));
  } catch {
    // Cache failure must never break the application.
  }
}
