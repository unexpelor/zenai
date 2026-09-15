import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const buckets = new Map();
const MAX_BUCKETS = 5000;

function pruneBuckets(now) {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [key, value] of buckets) {
    if (now - value.startedAt >= 60_000) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS * 0.8) break;
  }
}

export async function requireApiUser(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const authorization = request.headers.get("authorization") || "";

  if (process.env.ZENAI_ALLOW_UNAUTHENTICATED_API === "true" && process.env.NODE_ENV !== "production") {
    return { ok: true, user: null, bypassed: true };
  }

  if (!url || !key) {
    return { ok: false, status: 503, message: "Autentikasi server belum dikonfigurasi." };
  }

  if (!authorization.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Sesi pengguna diperlukan." };
  }

  const token = authorization.slice(7).trim();
  if (!token) {
    return { ok: false, status: 401, message: "Sesi pengguna tidak valid." };
  }

  try {
    const supabase = createSupabaseClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user?.id) {
      return { ok: false, status: 401, message: "Sesi pengguna tidak valid atau telah berakhir." };
    }

    return { ok: true, user: data.user };
  } catch (error) {
    console.error("API AUTH ERROR:", error);
    return { ok: false, status: 401, message: "Sesi pengguna tidak dapat diverifikasi." };
  }
}

export function rateLimit(request, keyPrefix, limit, windowMs = 60_000, identity = "anonymous") {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const key = `${keyPrefix}:${identity}:${ip}`;
  const now = Date.now();
  pruneBuckets(now);
  const existing = buckets.get(key);

  if (!existing || now - existing.startedAt >= windowMs) {
    buckets.set(key, { startedAt: now, count: 1 });
    return { ok: true, remaining: Math.max(0, limit - 1) };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((windowMs - (now - existing.startedAt)) / 1000) };
  }

  return { ok: true, remaining: Math.max(0, limit - existing.count) };
}

export function jsonError(message, status = 400, extraHeaders = {}) {
  return Response.json(
    { success: false, message },
    { status, headers: extraHeaders }
  );
}
