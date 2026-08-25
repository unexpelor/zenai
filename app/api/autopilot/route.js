export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.business) {
      return Response.json(
        {
          message: "Data bisnis tidak ditemukan.",
        },
        {
          status: 400,
        }
      );
    }

    const duration = body.duration || 7;

    const prompt = `
Anda adalah Business Autopilot untuk UMKM Indonesia.

Buat strategi bisnis selama ${duration} hari berdasarkan data berikut.

DATA BISNIS:
${JSON.stringify(body.business, null, 2)}

ATURAN WAJIB:

1. JANGAN menampilkan proses berpikir.
2. JANGAN menggunakan tag <think>.
3. JANGAN menampilkan reasoning atau analisis internal.
4. JANGAN menggunakan markdown.
5. JANGAN menggunakan \`\`\`json.
6. LANGSUNG mulai output dengan karakter {
7. LANGSUNG akhiri output dengan karakter }
8. Jangan menulis teks apa pun sebelum JSON.
9. Jangan menulis teks apa pun setelah JSON.
10. Output HARUS JSON valid.

Gunakan struktur JSON berikut:

{
  "mission": {
    "title": "Judul strategi",
    "target": "Target utama",
    "duration": "${duration} hari",
    "priority": "HIGH"
  },
  "actions": [
    {
      "id": 1,
      "title": "Judul aksi",
      "type": "CONTENT",
      "description": "Penjelasan aksi",
      "output": "Hasil yang diharapkan"
    }
  ]
}

Buat jumlah action yang sesuai dengan durasi ${duration} hari.

Untuk 7 hari: buat maksimal 7 action.
Untuk 14 hari: buat maksimal 14 action.
Untuk 30 hari: buat maksimal 30 action.

Tetap ringkas agar JSON selesai dihasilkan.
`;

    const response = await fetch(
      new URL("/api/ai", req.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          system: `
Anda adalah Business Autopilot UMKM Indonesia.

PENTING:
Jangan tampilkan <think>.
Jangan tampilkan proses berpikir.
Jangan tampilkan reasoning internal.
Jangan gunakan markdown.
Jangan gunakan code block.
Output harus langsung berupa JSON valid.
Karakter pertama harus {
Karakter terakhir harus }
`,
        }),
      }
    );

    let data;

    try {
      data = await response.json();
    } catch (error) {
      return Response.json(
        {
          message:
            "Respons dari AI Router bukan JSON valid.",
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!response.ok) {
      console.error("AI ROUTER ERROR:", data);

      return Response.json(
        {
          message:
            data.message ||
            data.error ||
            "AI gagal",

          details:
            data.details || [],

          configured:
            data.configured || {},
        },
        {
          status: response.status || 500,
        }
      );
    }

    let raw = String(data.text || "").trim();

    if (!raw) {
      return Response.json(
        {
          message:
            "AI tidak mengembalikan respons.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================
    // BERSIHKAN MARKDOWN
    // =========================

    raw = raw
      .replace(/```json/gi, "")
      .replace(/```JSON/gi, "")
      .replace(/```/g, "")
      .trim();

    // =========================
    // HAPUS THINKING BLOCK
    // =========================

    raw = raw
      .replace(
        /<think>[\s\S]*?<\/think>/gi,
        ""
      )
      .trim();

    // Jika AI menggunakan tag reasoning lain
    raw = raw
      .replace(
        /<thinking>[\s\S]*?<\/thinking>/gi,
        ""
      )
      .trim();

    // =========================
    // CARI JSON
    // =========================

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1 ||
      end <= start
    ) {
      console.error(
        "AI TIDAK MENGHASILKAN JSON:",
        raw
      );

      return Response.json(
        {
          message:
            "AI tidak menghasilkan JSON lengkap.",

          raw,

          hint:
            "Model kemungkinan menghasilkan proses berpikir atau output terpotong sebelum JSON selesai.",
        },
        {
          status: 500,
        }
      );
    }

    const jsonText = raw
      .substring(
        start,
        end + 1
      )
      .trim();

    // =========================
    // PARSE JSON
    // =========================

    let result;

    try {
      result = JSON.parse(jsonText);

    } catch (error) {
      console.error(
        "JSON PARSE ERROR:",
        error.message
      );

      return Response.json(
        {
          message:
            "JSON AI tidak valid.",

          error:
            error.message,

          raw,

          jsonText,
        },
        {
          status: 500,
        }
      );
    }

    // =========================
    // VALIDASI HASIL
    // =========================

    if (
      !result ||
      typeof result !== "object"
    ) {
      return Response.json(
        {
          message:
            "Format respons AI tidak valid.",
          raw,
        },
        {
          status: 500,
        }
      );
    }

    if (!result.mission) {
      result.mission = {
        title: "Strategi Bisnis",
        target: "Meningkatkan pertumbuhan bisnis",
        duration: `${duration} hari`,
        priority: "HIGH",
      };
    }

    if (!Array.isArray(result.actions)) {
      result.actions = [];
    }

    return Response.json({
      result,
      provider:
        data.provider || "AI",
    });

  } catch (error) {
    console.error(
      "AUTOPILOT FATAL ERROR:",
      error
    );

    return Response.json(
      {
        message:
          error.message ||
          "Autopilot gagal.",

        error:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}
