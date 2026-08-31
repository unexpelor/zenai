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

  const text = String(value).trim();

  try {
    return JSON.parse(text);
  } catch (_) {}

  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[0]);
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
  const origin =
    req.headers.get("origin") ||
    `https://${req.headers.get("host")}`;

  const response = await fetch(
    `${origin}/api/ai`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        ...(req.headers.get("authorization")
          ? { Authorization: req.headers.get("authorization") }
          : {}),
      },

      body: JSON.stringify({
        prompt,
        system,
      }),

      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "AI gagal membuat analisis."
    );
  }

  return (
    data?.text ||
    data?.response ||
    data?.result ||
    data?.content ||
    data
  );
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
        .slice(0, 12)
        .map((item, index) => {
          return `
SUMBER ${index + 1}
Judul: ${item.title || ""}
URL: ${item.url || ""}
Tanggal: ${item.publishedDate || ""}
Isi: ${item.content || ""}
`;
        })
        .join("\n\n");

      /* =================================================
         ANALISIS AI
      ================================================= */

      const analysisPrompt = `
Anda adalah analis bisnis strategis.

Tugas Anda bukan sekadar merangkum berita.

Buat Perspektif Bisnis berdasarkan gabungan:
1. Informasi bisnis pengguna.
2. Kondisi industri.
3. Lokasi usaha.
4. Sumber eksternal terbaru.

INFORMASI USAHA

Jenis/Nama Usaha:
${business || "-"}

Industri:
${industry || "-"}

Lokasi:
${location || "-"}

DATA EKSTERNAL

${sourceContext || "Tidak ada sumber eksternal yang cukup."}

Lakukan analisis bisnis yang tajam dan realistis.

Fokus pada:

1. Kondisi pasar.
2. Sinyal permintaan.
3. Faktor eksternal yang memengaruhi usaha.
4. Risiko utama.
5. Peluang realistis.
6. Persaingan jika terdapat bukti.
7. Perspektif bisnis secara keseluruhan.
8. Tiga skenario:
   - optimistis
   - realistis
   - risiko
9. Implikasi strategis bagi pemilik usaha.

Jangan mengarang data.

Jika bukti eksternal terbatas, jelaskan keterbatasannya.

Jangan menyebut sumber yang tidak tersedia.

Kembalikan HANYA JSON valid:

{
  "summary": "",
  "marketCondition": "",
  "demandSignal": {
    "status": "meningkat",
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
  "confidence": "sedang",
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

        if (!analysis) {
          analysis = {
            summary:
              "Data eksternal berhasil dikumpulkan, tetapi hasil analisis AI tidak dapat diproses dalam format terstruktur.",
            confidence: "rendah",
            limitations:
              "Respons AI tidak dapat diubah menjadi format analisis terstruktur.",
          };
        }
      } catch (error) {
        console.error(
          "MARKET ANALYSIS ERROR:",
          error
        );

        analysis = {
          summary:
            "Sumber eksternal berhasil dikumpulkan, tetapi analisis AI belum dapat dibuat.",
          confidence: "rendah",
          limitations:
            error?.message ||
            "Terjadi kendala saat memproses analisis AI.",
        };
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
