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

function uniqueArray(items) {
  return [...new Set(items.filter(Boolean))];
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
   BUAT QUERY OTOMATIS

   Tidak dikunci ke jenis usaha tertentu.
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

    publishedDate:
      cleanText(
        item.published_date ||
          item.publishedDate ||
          item.date
      ),
  }));
}

/* =========================================================
   POST
========================================================= */

export async function POST(req) {
  try {
    const body = await req.json();

    /*
      =====================================================
      MODE 1
      WAWASAN PASAR
      =====================================================
    */

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

      /*
        Jika frontend mengirim query sendiri,
        gunakan query tersebut.

        Jika tidak, sistem membuat query otomatis.
      */

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

      /*
        Cari informasi berdasarkan seluruh query.
      */

      const searchGroups =
        await Promise.all(
          queries.map(async (query) => {
            try {
              const results =
                await searchTavily(
                  query,
                  "general"
                );

              return {
                query,

                results:
                  normalizeResults(
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

      /*
        Tambahan 1 pencarian berita terbaru.

        Query berita dibuat berdasarkan industri
        atau jenis usaha.
      */

      const newsSubject =
        industry || business;

      let newsResults = [];

      if (newsSubject) {
        try {
          const results =
            await searchTavily(
              `${newsSubject} berita terbaru`,
              "news"
            );

          newsResults =
            normalizeResults(
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

      /*
        Gabungkan semua sumber
        lalu hapus URL duplikat.
      */

      const allResults = [
        ...searchGroups.flatMap(
          (group) => group.results
        ),

        ...newsResults,
      ];

      const seenUrls = new Set();

      const sourceContext = uniqueSources
  .slice(0, 12)
  .map((item, index) => {
    return `
SUMBER ${index + 1}
Judul: ${item.title || ""}
URL: ${item.url || ""}
Tanggal: ${item.publishedDate || item.date || ""}
Isi: ${item.content || item.snippet || item.description || ""}
`;
  })
  .join("\n\n");

const analysisPrompt = `
Anda adalah analis bisnis strategis.

Tugas Anda BUKAN sekadar merangkum berita.

Analisis usaha berikut berdasarkan:
1. Informasi bisnis pengguna.
2. Kondisi industri.
3. Lokasi usaha.
4. Data dan sumber eksternal yang tersedia.

INFORMASI USAHA:
Nama/Jenis Usaha: ${business}
Industri: ${industry}
Lokasi: ${location}

DATA EKSTERNAL:
${sourceContext || "Tidak ada sumber eksternal yang cukup."}

Lakukan ANALISIS FUNDAMENTAL DAN PERSPEKTIF BISNIS.

Fokus pada:

1. KONDISI PASAR
Jelaskan bagaimana kondisi pasar yang relevan terhadap usaha ini.

2. SINYAL PERMINTAAN
Identifikasi indikasi permintaan meningkat, stabil, atau menurun.

3. FAKTOR YANG MEMPENGARUHI BISNIS
Pisahkan faktor internal dan eksternal.

4. RISIKO UTAMA
Identifikasi risiko yang paling mungkin memengaruhi usaha.

5. PELUANG
Cari peluang yang realistis berdasarkan kondisi pasar dan bisnis.

6. PERSPEKTIF BISNIS
Berikan interpretasi strategis, bukan ringkasan berita.

7. SKENARIO
Buat:
- Skenario optimistis
- Skenario realistis
- Skenario risiko

8. IMPLIKASI STRATEGIS
Jelaskan apa yang sebaiknya diperhatikan pemilik usaha.

JANGAN mengarang data.

Jika bukti dari sumber tidak cukup, katakan bahwa kesimpulan memiliki keterbatasan.

Gunakan bahasa Indonesia yang jelas, tajam, dan mudah dipahami.

Kembalikan HANYA JSON valid dengan format:

{
  "summary": "",
  "marketCondition": "",
  "demandSignal": {
    "status": "meningkat | stabil | menurun | tidak pasti",
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
  "confidence": "tinggi | sedang | rendah",
  "limitations": ""
}
`;

let analysis = null;

try {
  const aiResult = await askAI({
    prompt: analysisPrompt,
    system:
      "Anda adalah AI analis bisnis yang berpikir secara fundamental, kritis, dan berbasis bukti.",
  });

  analysis = extractJson(aiResult);
} catch (error) {
  console.error("MARKET ANALYSIS ERROR:", error);

  analysis = {
    summary:
      "Sumber pasar berhasil dikumpulkan, tetapi analisis AI belum dapat dibuat.",
    confidence: "rendah",
    limitations:
      "Terjadi kendala saat memproses analisis berbasis sumber eksternal.",
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

    /*
      =====================================================
      MODE 2
      FUNGSI LAMA MARKETPLACE

      Dipertahankan agar tidak merusak
      integrasi yang sudah ada.
      =====================================================
    */

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

        error:
          error?.message ||
          "Terjadi kesalahan pada server.",
      },

      {
        status: 500,
      }
    );
  }
      }
