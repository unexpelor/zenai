import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";

const MAX_PAYLOAD_BYTES = 900_000;

async function callProvider(url, apiKey, model, prompt, system) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 12000,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error?.message || data?.message || "Translation provider failed.");
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Translation provider returned no content.");
  return text;
}

function extractJson(value) {
  if (value && typeof value === "object") return value;
  const cleaned = String(value || "").trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  try { return JSON.parse(cleaned); } catch { return null; }
}

function sameShape(source, translated) {
  if (Array.isArray(source)) {
    return Array.isArray(translated) && source.length === translated.length && source.every((v, i) => sameShape(v, translated[i]));
  }
  if (source && typeof source === "object") {
    if (!translated || typeof translated !== "object" || Array.isArray(translated)) return false;
    const a = Object.keys(source).sort();
    const b = Object.keys(translated).sort();
    return a.length === b.length && a.every((key, i) => key === b[i] && sameShape(source[key], translated[key]));
  }
  if (typeof source === "string") return typeof translated === "string";
  if (source === null) return translated === null;
  return typeof translated === typeof source;
}

export async function POST(request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return jsonError(auth.message, auth.status);

  const limited = rateLimit(request, "translate", 30, 60_000, auth.user?.id);
  if (!limited.ok) return jsonError("Terlalu banyak permintaan translation. Silakan coba lagi.", 429, { "Retry-After": String(limited.retryAfter) });

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_PAYLOAD_BYTES) return jsonError("Payload translation terlalu besar.", 413);

    const body = JSON.parse(raw);
    const locale = body?.locale === "en" ? "en" : "id";
    const payload = body?.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload) && payload.length === 0) return jsonError("Payload translation tidak valid.", 400);

    const outputLanguage = locale === "en" ? "English" : "Bahasa Indonesia";
    const source = JSON.stringify(payload);
    const system = `You are ZENAI's strict JSON localization engine. Translate every human-readable string VALUE into ${outputLanguage}. Preserve exact JSON keys, nesting, array lengths, primitive types, numbers, booleans, nulls, URLs, emails, IDs, dates, currency codes, enum values, code, technical identifiers, product/brand names, and quoted source text. Do not summarize, add, remove, reorder data, or change meaning. Return ONLY valid JSON.`;
    const prompt = `Translate this complete ZENAI payload to ${outputLanguage}. Only human-readable string values may be translated. Preserve all non-translatable technical/data values exactly.\n\nSOURCE JSON:\n${source}`;

    let text;
    if (process.env.GROQ_API_KEY) {
      text = await callProvider("https://api.groq.com/openai/v1/chat/completions", process.env.GROQ_API_KEY, process.env.GROQ_MODEL || "qwen/qwen3.6-27b", prompt, system);
    } else if (process.env.OPENROUTER_API_KEY) {
      text = await callProvider("https://openrouter.ai/api/v1/chat/completions", process.env.OPENROUTER_API_KEY, process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free", prompt, system);
    } else {
      return jsonError("Translation provider belum dikonfigurasi. Gunakan GROQ_API_KEY atau OPENROUTER_API_KEY.", 503);
    }

    const translated = extractJson(text);
    if (!translated || !sameShape(payload, translated)) return jsonError("Translation provider mengubah struktur payload. Hasil ditolak.", 502);
    return Response.json({ success: true, payload: translated });
  } catch (error) {
    console.error("Translation API error:", error);
    return jsonError(error?.message || "Translation gagal.", 500);
  }
}
