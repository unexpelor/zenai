import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";

const MAX_STRING_LENGTH = 12000;
const MAX_BATCH_CHARS = 9000;
const MAX_BATCH_STRINGS = 50;
const MAX_TOTAL_STRINGS = 1500;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-4-26b-a4b-it:free";
const FALLBACK_MODEL = "openrouter/free";

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

function languageName(locale) {
  return locale === "en" ? "English" : "Bahasa Indonesia";
}

function buildTranslationPrompt(entries, sourceLocale, targetLocale) {
  const source = sourceLocale ? languageName(sourceLocale) : "the source language";
  const target = languageName(targetLocale);

  return [
    "Translate ONLY the values in the JSON object below.",
    `Source language: ${source}. Target language: ${target}.`,
    "Return ONLY a valid JSON object with exactly the same keys.",
    "Rules:",
    "- Preserve meaning and context; do not summarize or add information.",
    "- Preserve Markdown, bullets, headings, tables, line breaks, numbers, currencies, percentages and dates.",
    "- Preserve URLs, code, identifiers, product/business names and proper nouns unless they are ordinary prose that should naturally be translated.",
    "- Do not translate JSON keys.",
    "- Do not mix languages in the translated values.",
    "",
    JSON.stringify(Object.fromEntries(entries.map((entry, index) => [String(index), entry.value])))
  ].join("\n");
}

async function requestOpenRouter({ model, fallbackModels = [], entries, sourceLocale, targetLocale, apiKey, useJsonFormat = false, maxTokensBoost = 1 }) {
  const prompt = buildTranslationPrompt(entries, sourceLocale, targetLocale);
  const inputChars = entries.reduce((sum, item) => sum + item.value.length, 0);
  const body = {
    model,
    ...(fallbackModels.length ? { models: fallbackModels } : {}),
    messages: [
      { role: "system", content: "You are a precise professional translation engine. Translate the JSON values and return ONLY one valid JSON object using the numeric keys exactly as provided." },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    max_tokens: Math.min(8000, Math.max(1600, Math.ceil((inputChars / 2.2) * maxTokensBoost))),
    stream: false,
  };
  if (useJsonFormat) body.response_format = { type: "json_object" };

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://zenai.app",
      "X-Title": "ZENAI",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const providerMessage = data?.error?.message || data?.message || `OpenRouter gagal (${response.status}).`;
    const error = new Error(providerMessage);
    error.status = response.status;
    error.providerData = data?.error || data;
    throw error;
  }

  const choice = data?.choices?.[0];
  const message = choice?.message || {};
  const rawContent = message?.content;
  const text = Array.isArray(rawContent)
    ? rawContent
        .map((part) => (typeof part === "string" ? part : part?.text || ""))
        .join("")
    : rawContent;
  if (typeof text === "string" && text.trim()) return text;

  const finishReason = choice?.finish_reason || choice?.native_finish_reason;
  const providerError = data?.error?.message || data?.error?.metadata?.raw || data?.message;
  const error = new Error(providerError || `OpenRouter returned no text (finish_reason: ${finishReason || "unknown"}).`);
  error.status = 502;
  error.providerData = {
    model: data?.model || model,
    finish_reason: finishReason,
    choice_count: Array.isArray(data?.choices) ? data.choices.length : 0,
    error: data?.error,
    has_reasoning: typeof message?.reasoning === "string" && message.reasoning.trim().length > 0,
    content_type: Array.isArray(rawContent) ? "array" : typeof rawContent,
  };
  throw error;
}
function parseTranslationJson(text, entries) {
  const cleaned = String(text)
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("OpenRouter mengembalikan JSON terjemahan yang tidak valid.");
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new Error("OpenRouter mengembalikan JSON terjemahan yang tidak valid.");
    }
  }

  return entries.map((_, index) => {
    const translated = parsed?.[String(index)];
    if (typeof translated !== "string") throw new Error("Hasil terjemahan OpenRouter tidak lengkap.");
    return translated;
  });
}

async function translateBatch(entries, { targetLocale, sourceLocale, apiKey }) {
  const configuredModel = process.env.OPENROUTER_TRANSLATE_MODEL || DEFAULT_MODEL;
  const fallbackModels = [FALLBACK_MODEL].filter((value) => value && value !== configuredModel);
  let lastError = null;

  // Let OpenRouter perform model-level failover in one request instead of
  // making several sequential provider calls. This is both faster and more
  // reliable when the free provider returns a transient failure.
  try {
    const text = await requestOpenRouter({
      model: configuredModel,
      fallbackModels,
      entries,
      sourceLocale,
      targetLocale,
      apiKey,
      useJsonFormat: false,
    });
    return parseTranslationJson(text, entries);
  } catch (error) {
    lastError = error;
    console.warn("Translation provider attempt failed:", {
      model: configuredModel,
      fallbacks: fallbackModels,
      status: error?.status,
      message: error?.message,
      provider: error?.providerData,
    });
  }

  // If the provider exhausted its output budget, retry once with a larger
  // budget. This specifically prevents an otherwise valid JSON translation
  // from ending as an empty/truncated completion.
  if (lastError?.providerData?.finish_reason === "length") {
    try {
      const text = await requestOpenRouter({
        model: configuredModel,
        fallbackModels,
        entries,
        sourceLocale,
        targetLocale,
        apiKey,
        useJsonFormat: false,
        maxTokensBoost: 1.8,
      });
      return parseTranslationJson(text, entries);
    } catch (error) {
      lastError = error;
    }
  }

  // Structured output is a final compatibility fallback for providers that
  // support JSON mode but fail the plain prompt.
  try {
    const text = await requestOpenRouter({
      model: configuredModel,
      fallbackModels,
      entries,
      sourceLocale,
      targetLocale,
      apiKey,
      useJsonFormat: true,
      maxTokensBoost: 1.3,
    });
    return parseTranslationJson(text, entries);
  } catch (error) {
    lastError = error;
  }

  throw lastError || new Error("Translation provider failed.");
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

    const apiKey = process.env.OPENROUTER_TRANSLATE_API_KEY;
    if (!apiKey) return jsonError("OPENROUTER_TRANSLATE_API_KEY belum dikonfigurasi di server.", 503);

    const body = await request.json().catch(() => null);
    const content = body?.content;
    const targetLocale = body?.targetLocale === "en" ? "en" : body?.targetLocale === "id" ? "id" : null;
    const sourceLocale = body?.sourceLocale === "en" || body?.sourceLocale === "id" ? body.sourceLocale : null;

    if (!content || typeof content !== "object" || !targetLocale) {
      return jsonError("Payload translation tidak valid.", 400);
    }

    if (sourceLocale === targetLocale) {
      return Response.json({ success: true, content, translated: false, provider: "openrouter" });
    }

    const entries = collectStrings(content);
    if (entries.length === 0) {
      return Response.json({ success: true, content, translated: false, provider: "openrouter" });
    }
    if (entries.length > MAX_TOTAL_STRINGS) return jsonError("Payload translation terlalu besar.", 413);

    const translatedContent = structuredClone(content);
    const batches = chunkEntries(entries);

    for (const batch of batches) {
      const translated = await translateBatch(batch, { targetLocale, sourceLocale, apiKey });
      batch.forEach((entry, index) => setAtPath(translatedContent, entry.path, translated[index]));
    }

    return Response.json({
      success: true,
      content: translatedContent,
      translated: true,
      provider: "openrouter",
      model: process.env.OPENROUTER_TRANSLATE_MODEL || DEFAULT_MODEL,
    });
  } catch (error) {
    console.error("OPENROUTER TRANSLATION ERROR:", {
      message: error?.message,
      status: error?.status,
      provider: error?.providerData,
    });
    return jsonError(error?.message || "Translation service failed.", 502, {
      provider: "openrouter",
      apiKeyConfigured: Boolean(process.env.OPENROUTER_TRANSLATE_API_KEY),
    });
  }
}
