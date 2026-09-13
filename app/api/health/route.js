import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";

export const dynamic = "force-dynamic";

async function timedCheck(name, fn, locale = "id") {
  const started = Date.now();
  try { return { name, status: "operational", detail: await fn(), latencyMs: Date.now() - started }; }
  catch (error) { console.error(`HEALTH CHECK ${name}:`, error); return { name, status: "down", detail: locale === "en" ? "The service could not be verified at this time." : "Layanan tidak dapat diverifikasi saat ini.", latencyMs: Date.now() - started }; }
}
async function checkModels(url, headers, locale = "id") {
  const response = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return locale === "en" ? "Provider endpoint is responding." : "Endpoint provider merespons.";
}
export async function GET(request) {
  const locale = new URL(request.url).searchParams.get("locale") === "en" ? "en" : "id";
  const text = {
    tooMany: locale === "en" ? "Too many checks. Please try again shortly." : "Terlalu banyak pemeriksaan. Coba lagi sebentar.",
    supabase: locale === "en" ? "Database connection and user access verified." : "Koneksi database dan akses user terverifikasi.",
    supabaseMissing: locale === "en" ? "Supabase configuration is not available." : "Konfigurasi Supabase belum tersedia.",
    providerMissing: locale === "en" ? "Provider is not configured in this environment." : "Provider tidak dikonfigurasi pada environment ini.",
    tavily: locale === "en" ? "API responded and test search succeeded." : "API merespons dan pencarian uji berhasil.",
    tavilyMissing: locale === "en" ? "TAVILY_API_KEY is not configured." : "TAVILY_API_KEY belum dikonfigurasi.",
  };
  const auth = await requireApiUser(request);
  if (!auth.ok) return jsonError(auth.message, auth.status);
  const limit = rateLimit(request, "health", 6, 60_000, auth.user?.id || "anonymous");
  if (!limit.ok) return new Response(JSON.stringify({ success: false, message: text.tooMany }), { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(limit.retryAfter || 60) } });
  const services = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (supabaseUrl && supabaseKey) services.push(await timedCheck("Supabase Database", async () => {
    const supabase = createSupabaseClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: request.headers.get("authorization") } } });
    const { error } = await supabase.from("zenai_user_state").select("user_id").eq("user_id", auth.user.id).maybeSingle();
    if (error) throw error;
    return text.supabase;
  }), locale)); else services.push({ name: "Supabase Database", status: "down", detail: text.supabaseMissing });
  if (process.env.GROQ_API_KEY) services.push(await timedCheck("Groq", () => checkModels("https://api.groq.com/openai/v1/models", { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, locale), locale)); else services.push({ name: "Groq", status: "not_configured", detail: text.providerMissing });
  if (process.env.OPENROUTER_API_KEY) services.push(await timedCheck("OpenRouter", () => checkModels("https://openrouter.ai/api/v1/models", { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }, locale), locale)); else services.push({ name: "OpenRouter", status: "not_configured", detail: text.providerMissing });
  if (process.env.GEMINI_API_KEY) services.push(await timedCheck("Gemini", () => checkModels(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {}, locale), locale)); else services.push({ name: "Gemini", status: "not_configured", detail: text.providerMissing });
  if (process.env.TAVILY_API_KEY) {
    services.push(await timedCheck("Tavily Market Search", async () => {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
        },
        body: JSON.stringify({
          query: "Indonesia business market",
          topic: "general",
          search_depth: "basic",
          max_results: 1,
          include_answer: false,
          include_raw_content: false,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(7000),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || `HTTP ${response.status}`);
      }
      return text.tavily;
    }), locale));
  } else {
    services.push({ name: "Tavily Market Search", status: "down", detail: text.tavilyMissing });
  }
  const operational = services.filter((item) => item.status === "operational").length;
  return Response.json({ success: true, checkedAt: new Date().toISOString(), summary: { operational, total: services.length }, services }, { headers: { "Cache-Control": "no-store" } });
}
