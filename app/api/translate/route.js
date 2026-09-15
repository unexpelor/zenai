import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";

const MAX_STRING_LENGTH = 12000;
const MAX_BATCH_CHARS = 2400;
const MAX_BATCH_STRINGS = 12;
const MAX_TOTAL_STRINGS = 1500;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || "";
const DEEPL_API_URL = (process.env.DEEPL_API_URL || "https://api-free.deepl.com").replace(/\/$/, "");

const TECHNICAL_KEYS = new Set([
  "id", "_id", "uuid", "key", "code", "slug", "url", "uri", "href",
  "type", "enum", "unit", "currency", "currencyCode", "mimeType", "statusCode",
  "httpStatus", "provider", "model", "modelId", "apiKey", "token", "version",
  "languageCode", "locale", "sourceLocale", "targetLocale"
]);

function isUrl(value) {
  return /^(https?:\/\/|www\.|mailto:|tel:)/i.test(value.trim());
}

function isTechnicalString(value, key = "") {
  const text = value.trim();
  if (!text || text.length > MAX_STRING_LENGTH) return true;
  if (TECHNICAL_KEYS.has(key)) return true;
  if (isUrl(text)) return true;
  if (/^data:[^,]+,/i.test(text)) return true;
  if (/^-?\d+(?:[.,]\d+)?%?$/.test(text)) return true;
  if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(text)) return true;
  if (/^[a-f0-9]{16,}$/i.test(text)) return true;
  return false;
}

function collectStrings(value, path = [], output = []) {
  if (typeof value === "string") {
    if (!isTechnicalString(value, String(path[path.length - 1] || ""))) {
      output.push({ path, value });
    }
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, [...path, index], output));
    return output;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, [...path, key], output));
  }

  return output;
}

function setAtPath(root, path, value) {
  if (!path.length) return value;
  let cursor = root;
  for (let i = 0; i < path.length - 1; i += 1) cursor = cursor[path[i]];
  cursor[path[path.length - 1]] = value;
  return root;
}

function chunkEntries(entries) {
  const batches = [];
  let current = [];
  let chars = 0;

  for (const entry of entries) {
    const size = entry.value.length;
    if (current.length && (chars + size > MAX_BATCH_CHARS || current.length >= MAX_BATCH_STRINGS)) {
      batches.push(current);
      current = [];
      chars = 0;
    }
    current.push(entry);
    chars += size;
  }
  if (current.length) batches.push(current);
  return batches;
}

function mapLocale(locale) {
  return locale === "en" ? "EN" : "ID";
}

async function requestDeepL({ entries, sourceLocale, targetLocale }) {
  if (!DEEPL_API_KEY) {
    const error = new Error("DEEPL_API_KEY belum dikonfigurasi di server.");
    error.status = 503;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const body = new URLSearchParams();
    entries.forEach((entry) => body.append("text", entry.value));
    body.set("source_lang", mapLocale(sourceLocale));
    body.set("target_lang", mapLocale(targetLocale));
    body.set("preserve_formatting", "1");

    const response = await fetch(`${DEEPL_API_URL}/v2/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: controller.signal,
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = data?.message || data?.error || `DeepL gagal (${response.status}).`;
      const error = new Error(message);
      error.status = response.status;
      error.providerData = data;
      throw error;
    }

    const translations = Array.isArray(data?.translations)
      ? data.translations.map((item) => item?.text)
      : null;

    if (!translations || translations.length !== entries.length || translations.some((value) => typeof value !== "string")) {
      const error = new Error("DeepL mengembalikan hasil terjemahan yang tidak lengkap.");
      error.status = 502;
      error.providerData = data;
      throw error;
    }

    return translations;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("DeepL timeout.");
      timeoutError.status = 504;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function translateBatch(entries, { targetLocale, sourceLocale }) {
  return requestDeepL({ entries, sourceLocale, targetLocale });
}

export async function POST(request) {
  try {
    const auth = await requireApiUser(request);
    if (!auth.ok) return jsonError(auth.message, auth.status);

    const identity = auth.user?.id || "anonymous";
    const limit = rateLimit(request, "translate", 30, 60_000, identity);
    if (!limit.ok) {
      return jsonError(
        "Translation rate limit exceeded. Please try again shortly.",
        429,
        { "Retry-After": String(limit.retryAfter) }
      );
    }

    if (!DEEPL_API_KEY) return jsonError("DEEPL_API_KEY belum dikonfigurasi di server.", 503);

    const body = await request.json().catch(() => null);
    const content = body?.content;
    const targetLocale = body?.targetLocale === "en" ? "en" : body?.targetLocale === "id" ? "id" : null;
    const sourceLocale = body?.sourceLocale === "en" || body?.sourceLocale === "id" ? body.sourceLocale : null;

    if (!content || typeof content !== "object" || !targetLocale) {
      return jsonError("Payload translation tidak valid.", 400);
    }

    if (sourceLocale === targetLocale) {
      return Response.json({ success: true, content, translated: false, provider: "deepl" });
    }

    const entries = collectStrings(content);
    if (entries.length === 0) {
      return Response.json({ success: true, content, translated: false, provider: "deepl" });
    }
    if (entries.length > MAX_TOTAL_STRINGS) return jsonError("Payload translation terlalu besar.", 413);

    const translatedContent = structuredClone(content);
    const batches = chunkEntries(entries);

    for (const batch of batches) {
      const translated = await translateBatch(batch, { targetLocale, sourceLocale });
      batch.forEach((entry, index) => setAtPath(translatedContent, entry.path, translated[index]));
    }

    return Response.json({
      success: true,
      content: translatedContent,
      translated: true,
      provider: "deepl",
    });
  } catch (error) {
    console.error("DEEPL ERROR:", {
      message: error?.message,
      status: error?.status,
      provider: error?.providerData,
    });
    return jsonError(error?.message || "Translation service failed.", 502, {
      provider: "deepl",
      configured: Boolean(DEEPL_API_KEY),
    });
  }
}
