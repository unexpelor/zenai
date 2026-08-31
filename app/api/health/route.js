import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";

export const dynamic = "force-dynamic";

async function timedCheck(name, fn) {
  const started = Date.now();
  try { return { name, status: "operational", detail: await fn(), latencyMs: Date.now() - started }; }
  catch (error) { console.error(`HEALTH CHECK ${name}:`, error); return { name, status: "down", detail: "Layanan tidak dapat diverifikasi saat ini.", latencyMs: Date.now() - started }; }
}
async function checkModels(url, headers) {
  const response = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return "Endpoint provider merespons.";
}
export async function GET(request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return jsonError(auth.message, auth.status);
  const limit = rateLimit(request, "health", 6, 60_000, auth.user?.id || "anonymous");
  if (!limit.ok) return new Response(JSON.stringify({ success: false, message: "Terlalu banyak pemeriksaan. Coba lagi sebentar." }), { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(limit.retryAfter || 60) } });
  const services = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (supabaseUrl && supabaseKey) services.push(await timedCheck("Supabase Database", async () => {
    const supabase = createSupabaseClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: request.headers.get("authorization") } } });
    const { error } = await supabase.from("zenai_user_state").select("user_id").eq("user_id", auth.user.id).maybeSingle();
    if (error) throw error;
    return "Koneksi database dan akses user terverifikasi.";
  })); else services.push({ name: "Supabase Database", status: "down", detail: "Konfigurasi Supabase belum tersedia." });
  if (process.env.GROQ_API_KEY) services.push(await timedCheck("Groq", () => checkModels("https://api.groq.com/openai/v1/models", { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }))); else services.push({ name: "Groq", status: "configured", detail: "Provider tidak dikonfigurasi pada environment ini." });
  if (process.env.OPENROUTER_API_KEY) services.push(await timedCheck("OpenRouter", () => checkModels("https://openrouter.ai/api/v1/models", { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }))); else services.push({ name: "OpenRouter", status: "configured", detail: "Provider tidak dikonfigurasi pada environment ini." });
  if (process.env.GEMINI_API_KEY) services.push(await timedCheck("Gemini", () => checkModels(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {}))); else services.push({ name: "Gemini", status: "configured", detail: "Provider tidak dikonfigurasi pada environment ini." });
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
      return "API merespons dan pencarian uji berhasil.";
    }));
  } else {
    services.push({ name: "Tavily Market Search", status: "down", detail: "TAVILY_API_KEY belum dikonfigurasi." });
  }
  const operational = services.filter((item) => item.status === "operational").length;
  return Response.json({ success: true, checkedAt: new Date().toISOString(), summary: { operational, total: services.length }, services }, { headers: { "Cache-Control": "no-store" } });
}
