import * as deepl from "deepl-node";
import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";

const MAX_STRING_LENGTH = 5000;
const MAX_BATCH_CHARS = 9000;
const MAX_BATCH_STRINGS = 50;
const MAX_TOTAL_STRINGS = 1500;

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
  if (/^```[\s\S]*```$/.test(text)) return true;
  if (/^-?\d+(?:[.,]\d+)?%?$/.test(text)) return true;
  if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(text)) return true;
  if (/^[a-f0-9]{16,}$/i.test(text)) return true;
  if (/^[A-Z0-9][A-Z0-9_.:/-]{2,}$/.test(text) && !/\s/.test(text)) return true;
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
    Object.entries(value).forEach(([key, item]) =>
      collectStrings(item, [...path, key], output)
    );
  }

  return output;
}

function setAtPath(root, path, value) {
  if (!path.length) return value;

  let cursor = root;
  for (let i = 0; i < path.length - 1; i += 1) {
    cursor = cursor[path[i]];
  }

  cursor[path[path.length - 1]] = value;
  return root;
}

function chunkEntries(entries) {
  const batches = [];
  let current = [];
  let chars = 0;

  for (const entry of entries) {
    const size = entry.value.length;

    if (
      current.length &&
      (chars + size > MAX_BATCH_CHARS ||
        current.length >= MAX_BATCH_STRINGS)
    ) {
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

function getDeepLTargetLanguage(targetLocale) {
  // DeepL uses regional English target codes.
  // Keep the application's locale as "en", but send "en-US" to DeepL.
  return targetLocale === "en" ? "en-US" : "id";
}

async function translateBatch(entries, { targetLocale, sourceLocale, apiKey }) {
  const client = new deepl.DeepLClient(apiKey, {
    maxRetries: 2,
    minTimeout: 1000,
    sendPlatformInfo: false,
  });

  const targetLanguage = getDeepLTargetLanguage(targetLocale);
  const sourceLanguage = sourceLocale || null;

  const results = await client.translateText(
    entries.map((entry) => entry.value),
    sourceLanguage,
    targetLanguage
  );

  const translations = Array.isArray(results) ? results : [results];

  if (translations.length !== entries.length) {
    throw new Error("DeepL Translation API returned an invalid response.");
  }

  return translations.map((item) => item?.text ?? "");
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

    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
      return jsonError(
        "DEEPL_API_KEY belum dikonfigurasi di server.",
        503
      );
    }

    const body = await request.json().catch(() => null);
    const content = body?.content;

    const targetLocale =
      body?.targetLocale === "en"
        ? "en"
        : body?.targetLocale === "id"
          ? "id"
          : null;

    const sourceLocale =
      body?.sourceLocale === "en" || body?.sourceLocale === "id"
        ? body.sourceLocale
        : null;

    if (!content || typeof content !== "object" || !targetLocale) {
      return jsonError("Payload translation tidak valid.", 400);
    }

    if (sourceLocale === targetLocale) {
      return Response.json({
        success: true,
        content,
        translated: false,
      });
    }

    const entries = collectStrings(content);

    if (entries.length === 0) {
      return Response.json({
        success: true,
        content,
        translated: false,
      });
    }

    if (entries.length > MAX_TOTAL_STRINGS) {
      return jsonError("Payload translation terlalu besar.", 413);
    }

    const translatedContent = structuredClone(content);
    const batches = chunkEntries(entries);

    for (const batch of batches) {
      const translated = await translateBatch(batch, {
        targetLocale,
        sourceLocale,
        apiKey,
      });

      batch.forEach((entry, index) => {
        setAtPath(translatedContent, entry.path, translated[index]);
      });
    }

    return Response.json({
      success: true,
      content: translatedContent,
      translated: true,
      provider: "deepl",
    });
  } catch (error) {
    const safeDiagnostics = {
      provider: "deepl",
      providerStatus:
        Number.isInteger(error?.statusCode) ? error.statusCode : null,
      apiKeyConfigured: Boolean(process.env.DEEPL_API_KEY),
      apiKeyLast6: process.env.DEEPL_API_KEY
        ? process.env.DEEPL_API_KEY.slice(-6)
        : null,
    };

    console.error("DEEPL TRANSLATE API ERROR:", {
      message: error?.message,
      ...safeDiagnostics,
    });

    return jsonError(
      error?.message || "Translation service failed.",
      502,
      safeDiagnostics
    );
  }
}
