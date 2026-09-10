import { jsonError, rateLimit, requireApiUser } from "../../../lib/api-security";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TAVILY_URL = "https://api.tavily.com/search";

/* =========================================================
   HELPER
========================================================= */

function cleanText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function uniqueArray(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function extractJson(value) {
  if (!value) return null;

  if (typeof value === "object") {
    return value;
  }

  let text = String(value)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (_) {}

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (_) {
    return null;
  }
}

/* =========================================================
   TAVILY SEARCH
========================================================= */

async function searchTavily(query, topic = "general") {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error(
      "TAVILY_API_KEY belum ditemukan. Tambahkan API Key Tavily di Environment Variables."
    );
  }

  const response = await fetch(TAVILY_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },

    body: JSON.stringify({
      query,
      topic,
      search_depth: "basic",
      max_results: 5,
      include_answer: false,
      include_raw_content: false,
    }),

    cache: "no-store",
    signal: AbortSignal.timeout(7000),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        "Gagal mengambil informasi terbaru."
    );
  }

  return data?.results || [];
}

/* =========================================================
   QUERY OTOMATIS
========================================================= */

function createMarketQueries({
  business = "",
  location = "",
  industry = "",
}) {
  const mainSubject =
    cleanText(industry) ||
    cleanText(business);

  if (!mainSubject) {
    return [];
  }

  const locationText = location
    ? ` ${location}`
    : "";

  return uniqueArray([
    `${mainSubject} perkembangan terbaru Indonesia`,
    `${mainSubject} tren pasar terbaru${locationText}`,
    `${mainSubject} peluang dan tantangan bisnis terbaru`,
    `${mainSubject} persaingan dan perubahan pasar${locationText}`,
  ]).slice(0, 4);
}

/* =========================================================
   NORMALISASI HASIL
========================================================= */

function normalizeResults(results = [], query = "") {
  return results.map((item, index) => ({
    id: `${Date.now()}-${index}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    query,

    title: cleanText(item.title),

    content: cleanText(item.content),

    url: cleanText(item.url),

    score:
      typeof item.score === "number"
        ? item.score
        : null,

    publishedDate: cleanText(
      item.published_date ||
        item.publishedDate ||
        item.date
    ),
  }));
}

/* =========================================================
   AI ANALYSIS
========================================================= */

async function analyzeWithAI(req, prompt, system) {
  // Use the current request URL so this works in localhost and production.
  const aiUrl = new URL("/api/ai", req.url);

  const headers = {
    "Content-Type": "application/json",
  };

  const authorization = req.headers.get("authorization");
  if (authorization) {
    headers.Authorization = authorization;
  }

  const response = await fetch(aiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt,
      system,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    throw new Error(`AI mengembalikan respons yang tidak valid (${response.status}).`);
  }

  if (!response.ok) {
    const detail =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.details) ? data.details.join(" | ") : "") ||
      `AI gagal membuat analisis (${response.status}).`;

    throw new Error(detail);
  }

  const result =
    data?.text ??
    data?.response ??
    data?.result ??
    data?.content;

  if (!result) {
    throw new Error("AI tidak mengembalikan konten analisis.");
  }

  return result;
}

/* =========================================================
   POST
========================================================= */

export async function POST(req) {
  const auth = await requireApiUser(req);
  if (!auth.ok) return jsonError(auth.message, auth.status);

  const limited = rateLimit(req, "marketplace", 10, 60_000, auth.user?.id);
  if (!limited.ok) return jsonError("Terlalu banyak permintaan pencarian pasar. Silakan coba lagi.", 429, { "Retry-After": String(limited.retryAfter) });

  try {
    let body;
    try { body = await req.json(); } catch { return jsonError("Format permintaan tidak valid.", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return jsonError("Data permintaan tidak valid.", 400);
    if (JSON.stringify(body).length > 80_000) return jsonError("Data permintaan terlalu besar.", 413);

    /* =====================================================
       MODE 1
       WAWASAN PASAR / PERSPEKTIF BISNIS
    ===================================================== */

    if (body.action === "market-insight") {
      const businessProfile =
        body.businessProfile || {};

      const business = cleanText(
        businessProfile.business ||
          businessProfile.description ||
          businessProfile.name ||
          body.business ||
          body.businessText
      );

      const location = cleanText(
        businessProfile.location ||
          businessProfile.lokasi ||
          body.location
      );

      const industry = cleanText(
        businessProfile.industry ||
          businessProfile.industri ||
          body.industry
      );

      let queries = [];

      if (
        Array.isArray(body.queries) &&
        body.queries.length > 0
      ) {
        queries = uniqueArray(
          body.queries
            .map((item) => cleanText(item))
            .filter(Boolean)
        ).slice(0, 5);
      } else {
        queries = createMarketQueries({
          business,
          location,
          industry,
        });
      }

      if (queries.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Informasi usaha belum cukup untuk mencari Wawasan Pasar.",
          },
          {
            status: 400,
          }
        );
      }

      /* =================================================
         CARI DATA EKSTERNAL
      ================================================= */

      const searchGroups = await Promise.all(
        queries.map(async (query) => {
          try {
            const results = await searchTavily(
              query,
              "general"
            );

            return {
              query,
              results: normalizeResults(
                results,
                query
              ),
            };
          } catch (error) {
            console.error(
              "TAVILY SEARCH ERROR:",
              query,
              error
            );

            return {
              query,
              results: [],
            };
          }
        })
      );

      const newsSubject =
        industry || business;

      let newsResults = [];

      if (newsSubject) {
        try {
          const results = await searchTavily(
            `${newsSubject} berita terbaru`,
            "news"
          );

          newsResults = normalizeResults(
            results,
            `${newsSubject} berita terbaru`
          );
        } catch (error) {
          console.error(
            "NEWS SEARCH ERROR:",
            error
          );
        }
      }

      /* =================================================
         GABUNGKAN & HAPUS DUPLIKASI
      ================================================= */

      const allResults = [
        ...searchGroups.flatMap(
          (group) => group.results
        ),
        ...newsResults,
      ];

      const seenUrls = new Set();

      const uniqueSources = allResults.filter(
        (item) => {
          if (!item?.url) {
            return false;
          }

          if (seenUrls.has(item.url)) {
            return false;
          }

          seenUrls.add(item.url);

          return true;
        }
      );

      /* =================================================
         SIAPKAN KONTEN SUMBER UNTUK AI
      ================================================= */

      const sourceContext = uniqueSources
        .slice(0, 10)
        .map((item, index) => {
          const content = cleanText(item.content).slice(0, 900);

          return [
            `SUMBER ${index + 1}`,
            `Judul: ${item.title || "-"}`,
            `URL: ${item.url || "-"}`,
            `Tanggal: ${item.publishedDate || "-"}`,
            `Isi: ${content || "-"}`,
          ].join("\n");
        })
        .join("\n\n");

      /* =================================================
         ANALISIS AI
      ================================================= */

      const analysisPrompt = `
Anda adalah analis bisnis strategis untuk UMKM Indonesia.

Analisis usaha berdasarkan:
1. informasi usaha,
2. industri,
3. lokasi,
4. sumber eksternal yang diberikan.

Jangan sekadar merangkum sumber. Hubungkan temuan eksternal dengan kondisi usaha.
Jangan mengarang angka, fakta, tren, atau kompetitor yang tidak didukung sumber.
Jika bukti tidak cukup, tuliskan "Belum tersedia bukti yang cukup.".

INFORMASI USAHA
Nama/Jenis Usaha: ${business || "-"}
Industri: ${industry || "-"}
Lokasi: ${location || "-"}

SUMBER EKSTERNAL
${sourceContext || "Tidak ada sumber eksternal."}

Kembalikan HANYA satu objek JSON valid, tanpa markdown dan tanpa teks sebelum/sesudah JSON.

Format wajib:
{
  "summary": "",
  "marketCondition": "",
  "demandSignal": {
    "status": "",
    "reason": ""
  },
  "businessPerspective": "",
  "externalFactors": [],
  "risks": [],
  "opportunities": [],
  "competitionInsight": "",
  "scenarios": {
    "optimistic": "",
    "realistic": "",
    "risk": ""
  },
  "strategicImplication": "",
  "limitations": ""
}
`;

      let analysis = null;

      try {
        const aiResult =
          await analyzeWithAI(
            req,
            analysisPrompt,
            "Anda adalah analis bisnis yang kritis, objektif, berbasis bukti, dan tidak membuat klaim tanpa dasar."
          );

        analysis =
          extractJson(aiResult);

        if (!analysis || typeof analysis !== "object") {
          throw new Error("AI tidak mengembalikan JSON analisis yang valid.");
        }

        analysis = {
          summary: cleanText(analysis.summary),
          marketCondition: cleanText(analysis.marketCondition),
          demandSignal: {
            status: cleanText(analysis.demandSignal?.status),
            reason: cleanText(analysis.demandSignal?.reason),
          },
          businessPerspective: cleanText(analysis.businessPerspective),
          externalFactors: Array.isArray(analysis.externalFactors)
            ? analysis.externalFactors.map(cleanText).filter(Boolean).slice(0, 8)
            : [],
          risks: Array.isArray(analysis.risks)
            ? analysis.risks.map(cleanText).filter(Boolean).slice(0, 8)
            : [],
          opportunities: Array.isArray(analysis.opportunities)
            ? analysis.opportunities.map(cleanText).filter(Boolean).slice(0, 8)
            : [],
          competitionInsight: cleanText(analysis.competitionInsight),
          scenarios: {
            optimistic: cleanText(analysis.scenarios?.optimistic),
            realistic: cleanText(analysis.scenarios?.realistic),
            risk: cleanText(analysis.scenarios?.risk),
          },
          strategicImplication: cleanText(analysis.strategicImplication),
          limitations: cleanText(analysis.limitations),
        };
      } catch (error) {
        console.error(
          "MARKET ANALYSIS ERROR:",
          error
        );

        return jsonError(
          error?.message ||
            "Sumber eksternal berhasil dikumpulkan, tetapi analisis AI belum dapat dibuat.",
          502,
          {
            "X-Market-Insight-Sources": String(uniqueSources.length),
          }
        );
      }

      return NextResponse.json({
        success: true,

        mode: "market-insight",

        updatedAt:
          new Date().toISOString(),

        profile: {
          business,
          industry,
          location,
        },

        queries,

        analysis,

        sources:
          uniqueSources.slice(0, 20),

        totalSources:
          uniqueSources.length,
      });
    }

    /* =====================================================
       MODE 2
       FUNGSI LAMA MARKETPLACE
    ===================================================== */

    return NextResponse.json({
      status: "connector-ready",

      channel: body.channel,

      listing: body.listing,

      nextStep:
        "Hubungkan OAuth/API resmi marketplace untuk direct sync.",
    });

  } catch (error) {
    console.error(
      "MARKETPLACE API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error: "Terjadi kesalahan pada layanan Market Insight.",
      },
      {
        status: 500,
      }
    );
  }
}
